//word为需要加密的String字符
function encrypt(word){
    //密钥--应和后台java解密或是前台js解密的密钥保持一致（16进制）
    var key = CryptoJS.enc.Utf8.parse("1111wwww2222uuuu");
    //偏移量
    var srcs = CryptoJS.enc.Utf8.parse(word);
    //算法
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    //替换--防止值为“1”的情况
    var reg = new RegExp('/',"g");
    return encrypted.toString().replace(reg,"#");
}

//获取token
function getToken(){
    var token = sessionStorage.getItem("token");
    return token;
}

//获取token
/*function getFunList(){
    var funreturn = null;
    var funList = sessionStorage.getItem("funlist");
    if(funList != null){
        funreturn = JSON.parse(funList);
    }
    return funreturn;
}*/

//判断字符串是否为空
function checkBlank(param){
    if(param == null || param == ''){
        return true
    }
    return false;
}

/**
 * 根据变量名获取匹配值
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

var resource_url = "http://192.168.1.79:8012/";
