var APP_ROOT = '';;
var LOADER_IMG = '/public/app/images/lazy_loading.gif';
var ERROR_IMG = '/public/app/images/image_err.gif';
var TMPL = 'https://www.wlgyjr.com/app/Tpl/new';
var send_span = 30000;
var to_send_msg = true;
var __LOGIN_KEY = "FqOmrIfkbVbmkxBTKtuaHOxtArEXFGsZVoxgvRNkCvllmLPEGy";
var __HASH_KEY__ = "eyezroxpfvNiHNTcUwuDlGZWxvCKnbGMERYWaROMEzNsZNeRKj";

function aes_pwd(pwd){
	return des(escape(__LOGIN_KEY+"%u6570%u5b57"+pwd+"%u52a0%u5bc6"));
}




function des(str){
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";                
    var i = 0, len= str.length, string = '';

    while (i < len){
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len){
                string += base64EncodeChars.charAt(c1 >> 2);
                string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                string += "==";
                break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len){
                string += base64EncodeChars.charAt(c1 >> 2);
                string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                string += "=";
                break;
        }
        c3 = str.charCodeAt(i++);
        string += base64EncodeChars.charAt(c1 >> 2);
        string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        string += base64EncodeChars.charAt(c3 & 0x3F)
    }
	return string;
}