var tels = util.GetQueryString("Code"); //获取
var arras = new Array();
var paymoney = null;
var pay_money = null;
function pay_sso(code) {
	var pay_url = util.GetNewUrl(HOST + "UserOrder/ScanCodeSubmitOrder");
	$.ajax({
		url: pay_url,
		data: {
			QrCode: code
		},
		type: 'POST',
		dataType: 'json',
		success: function (result) {
			if (result.Code == 100) {
				//获取订单金额
				$("#pay_money_span").html("￥" + result.Data.OrderCash);
				$("#pay_cash").html("￥" + result.Data.CaseBalance);
				//$("#pay_hidden").attr("OrderCode",result.Data.OrderCode);
				//var data =  result.Data.OrderCode
				paymoney = result.Data.OrderCash;
				var data = result.Data.OrderCode;
				arras.push(data);
				pay_money = result.Data.OrderCash
				$("#content").show();
			}
			else {
				util.showToast(result.Desc);

			}
		},
		error: function () {
			util.showToast("服务器连接失败,请稍后再试")
		}
	})
}



function inspect() {
	var url = util.GetNewUrl(HOST + "WxPublic/GetUserInfo");
	$.ajax({
		url: url,
		data: {},
		type: 'get',
		dataType: 'json',
		success: function (result) {
			if (result.Code == 100) {
				if (result.Data.Phone) {
					//用户扫码判断是否绑定手机号如果绑定调用支付
					pay_sso(tels)
				} else {
					//用户扫码判断是否绑定手机号如果没绑定跳转到注册页面

					window.location.href = "pay_register.html?token=" + util.getToken();
				}


			}
			else {
				util.showToast(result.Desc);
			}
		},
		error: function () {
			util.showToast("服务器连接失败,请稍后再试")
		}
	})
}

function confirm_pays() {
	$('#confirm_pay').removeAttr('onclick');
	var gopay = util.GetNewUrl(HOST + "UserPayment/GoPayWeiXin");
	var PayType = $("#pay_hidden").attr("mer");
	//var OrderCode = $("#pay_hidden").attr("OrderCode");
	$.ajax({
		url: gopay,
		data: {
			OrderCodeList: arras,
			OtherPayType: PayType,
			OtherAmount: paymoney

		},
		type: 'POST',
		dataType: 'json',
		success: function (result) {
			if (result.Code == 100) {
				//console.log(result)
				weixinpay(result);
				$('#confirm_pay').attr('onclick', "confirm_pays()");

			}
			else {
				util.showToast(result.Desc);
				$('#confirm_pay').attr('onclick', "confirm_pays()");
			}
		},
		error: function () {
			util.showToast("服务器连接失败,请稍后再试");
			$('#confirm_pay').attr('onclick', "confirm_pays()");
		}
	})
}


function weixinpay(result) {
	WeixinJSBridge.invoke(
		'getBrandWCPayRequest', {
			"appId": result.Data.WeixinPayload.AppId,     //公众号名称，由商户传入
			"timeStamp": result.Data.WeixinPayload.TimeStamp,         //时间戳，自1970年以来的秒数
			"nonceStr": result.Data.WeixinPayload.NonceStr, //随机串
			"package": result.Data.WeixinPayload.Package,
			"signType": result.Data.WeixinPayload.SignType,         //微信签名方式：
			"paySign": result.Data.WeixinPayload.Sign //微信签名
		},
		function (res) {
			// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
			if (res.err_msg == "get_brand_wcpay_request:ok") {
				
				// util.showToast(result.Desc);
				// window.location.href = "reserveSuccess.html?token=" + util.getToken() + "&pay_money=" + pay_money;
				//window.history.go(-3);
				WeixinJSBridge.call('closeWindow'); 
			}
			else if (res.err_msg == "get_brand_wcpay_request:fail") {
				util.showToast(result.Desc);
				//支付失败
				//alert("支付失败")

			}
			else if (res.err_msg == "get_brand_wcpay_request:cancel") {
				//支付过程中用户取消
			}

			//$(o).attr("disabled", false);
		}
	);
}