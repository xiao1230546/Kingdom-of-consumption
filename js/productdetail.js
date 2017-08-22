function ahde() {
	$.ajax({
		url: url,
		data: {
			OrgCode: OrgCode,
			OrgName: OrgName,
			UnionCode: UnionCode,
			MerchantType: MerctType,
			IndustryIds: IndustryIds,
			Lir: Lir,
			Tel: Tel,
			Address: Address,
			Lat: Lat,
			Lng: Lng,
			ProvinceId: ProvinceId,
			CityId: CityId,
			DistrictId: DistrictId
		},
		type: 'POST',
		dataType: 'json',
		success: function (result) {
			util.closeBusy();
			if (result.Code == 100) {
				window.location.href = "org3.html?token=" + util.getToken();
			} else {
				util.showToast(result.Desc);
			}
		},
		error: function () {
			util.closeBusy();
			util.showToast("服务器连接失败,请稍后再试")
		}
	})

}