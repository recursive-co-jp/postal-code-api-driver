/**
 * Copyright (c) 2018- Recursive Co.,Ltd.
 * Released under the MIT license
 * Date 2018-06-17
 */
var postalCodeApiDriver = {} || postalCodeApiDriver;

postalCodeApiDriver.postalCode2Addr= function(zipCode1Name, zipCode2Name, address1Name, address2Name='', address3Name='', lang='ja'){

	var zipCode1;
	var zipCode2;

	// 各郵便番号の値を取得する。
	zipCode1 = $("[name="+zipCode1Name+"]").val();
	zipCode2 = zipCode2Name !== ''? $("[name="+zipCode2Name+"]").val(): '';

	if(zipCode1.length === 3 && zipCode2.length === 4){
		;
	}else if(zipCode1.length === 7 && zipCode2 === '' && zipCode2Name === ''){
		zipCode2 = zipCode1.substr(3,4);
		zipCode1 = zipCode1.substr(0,3);
	}else{
		return false;
	}

	$.ajax({
		type: "get",
		url: "https://madefor.github.io/postal-code-api/api/v1/" + zipCode1 + "/" + zipCode2 + ".json",
		dataType: "json",
		cache : false
	}).done(function(data, textStatus, jqXHR){
		console.log(data);
		var resAddress1 = data['data'][0][lang]["prefecture"];
		var resAddress2 = data['data'][0][lang]["address1"];
		var resAddress3 = data['data'][0][lang]["address2"];

		if(address1Name !== '' && address2Name === '' && address3Name === ''){
			// １箇所入力の場合
			if(lang==='ja'){
				$("[name="+ address1Name + "]").val(resAddress1 + resAddress2 + resAddress3);
			}else if(lang==='en'){
				$("[name="+ address1Name + "]").val(resAddress3 + ', ' + resAddress2 + ', ' +resAddress1);
			}
		}else if(address1Name !== '' && address2Name !== '' && address3Name === ''){
			// 2箇所入力の場合
			if(lang==='ja'){
				if("select-one" === $("[name="+ address1Name + "]").get(0).type){
					var value = $("[name="+ address1Name + "] option:contains('" + resAddress1 + "')").val();
					$("[name="+ address1Name + "]").val(value);
				}else{
					$("[name="+ address1Name + "]").val(resAddress1);
				}
				$("[name="+ address2Name + "]").val(resAddress2 + resAddress3);
			}else if(lang==='en'){
				if("select-one" === $("[name="+ address1Name + "]").get(0).type){
					var value = $("[name="+ address1Name + "] option:contains('" + resAddress1 + "')").val();
					$("[name="+ address1Name + "]").val(value);
				}else{
					$("[name="+ address1Name + "]").val(resAddress1);
				}
				$("[name="+ address2Name + "]").val(resAddress3 + ', ' + resAddress2);
			}
		}else if(address1Name !== '' && address2Name !== '' && address3Name !== ''){
			// 3箇所入力の場合
			if("select-one" === $("[name="+ address1Name + "]").get(0).type){
				var value = $("[name="+ address1Name + "] option:contains('" + resAddress1 + "')").val();
				$("[name="+ address1Name + "]").val(value);
			}else{
				$("[name="+ address1Name + "]").val(resAddress1);
			}
			$("[name="+ address2Name + "]").val(resAddress2);
			$("[name="+ address3Name + "]").val(resAddress3);
		}else{
			return false;
		}
	}).fail(function(jqXHR, textStatus, errorThrown){
		console.log(textStatus);
		return false;
	});
};
