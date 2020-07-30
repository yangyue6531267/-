// //播放地址
// //调度接口
// function edsUrl(){
//     console.log(yh.device_id+"^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"+yh.playEds)
//       var params={
//         UserID:yh.device_id
//     }
//     var str=yh.playEds;
//     str=str.slice(7,-19);
//     var edsstr=str;
//     var edsurl="http://"+edsstr+ "/EDS/jsp/AuthenticationURL?Action=Login&UserID=" +"58B42DCF510A" + "&return_type=1"
//     console.log("edsurl"+edsurl)
//     submitPrompt('getHttp', { 'httpUrl': encodeURIComponent(edsurl), return: 'getEpgurl' });
//       // prompt('getHttp',{ httpUrl:edsurl ,return: 'getEpgurl' })
//   }
//   function getEpgurl(res){
//     console.log("edsres"+JSON.stringify(res))
//     var edsres=res.epgurl
//   // {"epgurl":"http://111.13.42.16:33200/EPG/jsp/AuthenticationURL?Action=Login&UserID=13522071528&SampleId=1"}
//     return edsres;
//   } 
  
//   //挑战字接口
//   function EncryToken(){
//     var params={
//         userid:yh.device_id,//58B42DCF510A
//         client_id:"android",
//         response_type:"EncryToken"
//       }
//     console.log("获取edsres",getEpgurl());
//     var edsres = getEpgurl();
//     edsres=edsres.slice(7,25);
//     var EncryTokenurl="http://"+edsres+"/EPG/oauth/v2/authorize?userid="+params.userid+"client_id="+params.client_id+"response_type="+params.response_type;
//     console.log("EncryTokenurl",EncryTokenurl);
//     submitPrompt('getHttp', { 'httpUrl': encodeURIComponent(EncryTokenurl), return: 'getEpgurl' });
//   }
//   function getEncryTokenurl(res){
//     console.log("EncryToken",JSON.stringify(res));
//     var getEncryTokenres=res.EncryToken;
//   // {"EncryToken": "A1A3C715283038A8F737359CB8107303"}
//     return getEncryTokenres;
//   }
  
//   //获取访问令牌
//   function accessToken(){
//     var edsres = getEpgurl();
//     var edsip=edsres.slice(7,25);
//     var edsSampleId=edsres.slice(-1);
//     //authinfo加密参数获取
//     var EncryToken = getEncryTokenurl();
//     var Random=String(Math.random()).substring(2, 8);
//     var aEncryToken=EncryToken;
//     var UserID=yh.eth0_mac;
//     var DevicesID= yh.device_id;
//     var IP = yh.ip;
//     var str=yh.eth0_mac;
    // var arrayStr = [];
    // for (var i = 1; i < 7; i++) {
    //             var j = i * 2 - 2;
    //             arrayStr[i-1] = str.substr(j, 2);
    //         }
    // var MAC= arrayStr.join(":");
//     var Reserved = "Reserved";
//     var unencrypt = Random + "$" + aEncryToken + "$" +UserID + "$" + DevicesID +"$" + IP +"$" + MAC + "$" + Reserved + "$" + "OTT";
//     var encrypt =  encryptByDES(unencrypt,"000000");
//     var params={
//           grant_type: "grant_type",
//           client_id: "android",
//           userID: yh.device_id,//58B42DCF510A
//           DeviceType: yh.model,
//           DeviceVersion: yh.softVName,//终端版本号
//           authinfo: encrypt ,//3des加密后
//           DeviceID: '',
//           MAC: '',
//           SampleId: edsSampleId,
//         }
//     var accessTokenurl="http://"+ edsip + "EPG/oauth/v2/token?authinfo=" + params.authinfo + "UserID=" + params.userID + "DeviceVersion=" + params.DeviceVersion + "client_id=" + params.client_id + "grant_type=" + params.grant_type + "DeviceType=" + params.DeviceType + "DeviceID=" + params.DeviceID + "MAC=" + params.MAC + "SampleId=" + params.SampleId;
//         submitPrompt('getHttp', { 'httpUrl': encodeURIComponent(accessTokenurl), return: 'getAccessToken'})
//   }
//   function getAccessToken(res){
//     console.log("getAccessTokenres"+ JSON.stringify(res));
//   }

// //

// //3Des加密
// function encryptByDES(value, key) {
//     if (value == '') return '';
//     var keyHex = CryptoJS.enc.Utf8.parse(key);
//     var encrypted = CryptoJS.DES.encrypt(value, keyHex, {
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7
//     });
//     // return encrypted.toString();
//     var hexstr =  encrypted.ciphertext.toString().toUpperCase();

//     return hexstr;
// }

// function Decrypt3Des(str, aStrKey, ivstr) {

//     const KeyHex = CryptoJS.enc.Utf8.parse(aStrKey);

//     //因为我们加密的时候用到的16进制字符串，需要进行转换

//     //第一步把16进制字符串转为WordArray格式

//     const WordArray = CryptoJS.enc.Hex.parse(str);

//     //第二步把WordArray再转为base64的字符串

//     const base64str = CryptoJS.enc.Base64.stringify(WordArray);

//     //第三步再进行解密

//     const decrypted = CryptoJS.TripleDES.decrypt(base64str,

//         KeyHex,

//         {
//             mode: CryptoJS.mode.ECB,
//             padding: CryptoJS.pad.Pkcs7
//             // mode: CryptoJS.mode.CBC,

//             // padding: CryptoJS.pad.Pkcs7,

//             // iv: CryptoJS.enc.Utf8.parse(ivstr)

//         });

//     return decrypted.toString(CryptoJS.enc.Utf8);

// }
// var jiami = "D9C5BD1221C3D5F94AF2505B213AB5E83806C6BE3EAAB4F1C6B82B40DDB446944CD9D0923CBE549085E1E9FCA7AA3CD92F235F60F9652DBB8662F0ACF91C38557E01C66EB6D0B68CC587565B090B02DE52321B8EEBFE1E67B6E0CC0E50D7FC97794830CE72E942EFA39800D622F7B44000E5C9CE17A52014FAAE617C2445155E8ABA7EFD625BAFF7";
// var str = Decrypt3Des(jiami, '000000');
// console.log("示例解密:" + str);

// // 原文:123456$A1A3C715283038A8F737359CB8107303$58B42DCF510A$E8CA700C492F4FDC80EB9B96FFED6F74$183.131.15.9$58:B4:2D:CF:51:0A$Reserved$OTT
// // 解密:646033$DC4548F84C03D25A70B32FB38C9EF384$60313BCCCC4F$003201FF0001182001AA60313BCCCC4F$192.168.1.30$60:31:3B:CC:CC:4F$Reserved$OTT
// var waitingString = "123456$A1A3C715283038A8F737359CB8107303$58B42DCF510A$E8CA700C492F4FDC80EB9B96FFED6F74$183.131.15.9$58:B4:2D:CF:51:0A$Reserved$OTT";
// console.log("加密");
// var tem =  encryptByDES(waitingString,"000000");
// console.log("加密结果:"+tem);
// // 加密结果:5FC2964D5FC60D93614220471E0900C0D109CC8F7FFB000C0E3576C3E891472B0A0AC88F2F6B7E2B1F31468E713CB3069A5F5F2D72FE2557F62BC3221F586B71B09997AB56F951E7036BBF03A33D7D049208162FB02D88666262FE68E5886B0B2493EC47EC6DCC6BA465C1C603D372EE2A1CA9BB490E7625FAAE617C2445155E8ABA7EFD625BAFF7
// //var mingwen = Decrypt3Des(tem, '000000');
// //console.log("密文解密:" + str);