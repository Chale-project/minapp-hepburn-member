function formatTime(timeStamp) {
	var date = new Date(timeStamp)
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	return [year, month, day].map(formatNumber).join('-');
	//return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
	n = n.toString();
	return n[1] ? n : '0' + n;
}

function timeStamp(str) {
	const dateTmp = str.replace(/-/g, '/')
	return new Date(dateTmp).getTime()
}

/**
 * 获取打包环境中配置的服务商service：'oauth'、'share'、'payment'、'push'
 */
function getProvider(service) {
	return new Promise(function(resolve, reject) {
		uni.getProvider({
			service: service,
			success: function(res) {
				console.log('provider:success', res)
				resolve(res);
			},
			fail: function(err) {
				console.log('provider:err', err)
				reject(err);
			}
		})
	});
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
	return new Promise(function(resolve, reject) {
		uni.checkSession({
			success: function() {
				resolve(true);
			},
			fail: function() {
				reject(false);
			}
		})
	});
}

/**
 * 调用微信登录
 */
function login(provider) {
	return new Promise(function(resolve, reject) {
		uni.login({
			provider: provider,
			// #ifdef MP-ALIPAY
			scopes: 'auth_base', // 支付宝小程序需设置授权类型auth_base（静默授权）/ auth_user（主动授权）/ auth_zhima （获取用户芝麻信息）
			// #endif
			success: function(res) {
				if (res.code) {
					// 登录远程服务器
					console.log('微信登陆成功', res)
					resolve(res);
				} else {
					reject(res);
				}
			},
			fail: function(err) {
				reject(err);
			}
		});
	});
}

/**
 * 获取微信授权项
 */
function getWxSetting() {
	return new Promise(function(resolve, reject) {
		uni.getSetting({
			success: function(res) {
				// console.log('获取用户授权设置成功', res)
				resolve(res)
			},
			fail: function(err) {
				// console.log('获取用户授权设置失败', err)
				reject(err);
			}
		});
	});
}

/**
 * 打开微信授权设置页面
 */
function openWxSetting() {
	return new Promise(function(resolve, reject) {
		uni.openSetting({
			success: function(res) {
				// console.log('打开用户授权设置成功', res)
				resolve(res)
			},
			fail: function(err) {
				// console.log('打开用户授权设置失败', err)
				reject(err);
			}
		});
	});
}

/**
 * 拉起微信授权项
 */
function setWxAuthorize(scope) {
	return new Promise(function(resolve, reject) {
		console.log(scope)
		uni.authorize({
			scope: scope,
			success: function(res) {
				// console.log('拉起用户授权设置成功', res)
				resolve(res)
			},
			fail: function(err) {
				// console.log('拉起用户授权设置失败', err)
				reject(err);
			}
		});
	});
}

/**
 * 选择微信地址
 */
function chooseWxLocation() {
	return new Promise(function(resolve, reject) {
		uni.chooseLocation({
			success: function(res) {
				// console.log('获取地址成功', res)
				resolve(res)
			},
			fail: function(err) {
				// console.log('获取地址失败', err)
				reject(err);
			}
		});
	});
}


/**
 * 调用微信已经授权过
 */
function getSetting() {
	return new Promise(function(resolve, reject) {
		uni.getSetting({
			success: function(res) {
				console.log('获取用户授权设置成功', res)
				if (res.authSetting['scope.userInfo']) { // 已经授权，可以直接显示绑定手机号
					resolve(res);
				} else { //没有授权跳到授权页面
					uni.navigateTo({
						url: "/pages/auth/auth"
					});
				}
			},
			fail: function(err) {
				console.log('获取用户授权设置失败', err)
				reject(err);
			}
		});
	});
}

/**
 * 调用微信获取用户信息接口，需要button授权
 */
function getUserInfo(provider) {
	return new Promise(function(resolve, reject) {
		uni.getUserInfo({
			provider: provider || 'weixin',
			// #ifdef MP-WEIXIN || MP-TOUTIAO
			withCredentials: true,
			lang: 'zh_CN',
			// #endif
			success: function(res) {
				console.log('获取用户信息成功', res);
				resolve(res);
			},
			fail: function(err) {
				console.log('获取用户信息失败', err);
				reject(err);
			}
		})
	})
}

/**
 * 调用微信选择图片接口
 */
function chooseImage(count) {
	return new Promise(function(resolve, reject) {
		uni.chooseImage({
			count: count,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success(res) {
				// tempFilePath可以作为img标签的src属性显示图片
				console.log('获取图片成功', res);
				resolve(res);
			},
			fail: function(err) {
				console.log('获取图片失败', err);
				reject(err);
			}
		})
	})
}

/**
 * 调用微信上传图片接口
 */
function uploadFile(f, i) {
	return new Promise(function(resolve, reject) {
		uni.uploadFile({
			url: api.uploadFile,
			filePath: f[i],
			header: {
				'token': uni.getStorageSync('token')
			},
			name: 'file',
			formData: null,
			success(res) {
				console.log('图片上传成功', res);
				resolve(res);
			},
			fail: function(err) {
				console.log('图片上传失败', err);
				reject(err);
			}
		})
	})
}

/**
 * 微信获取经纬度
 */
function getLocation() {
	return new Promise(function(resolve, reject) {
		uni.getLocation({
			type: "gcj02",
			success: function(res) {
				// console.log('获取地理位置成功', res);
				resolve(res);
			},
			fail: function(err) {
				// console.log('获取地理位置失败', err);
				reject(err);
			}
		});
	})
}

function getQueryString(url, key) {
	var _url = decodeURIComponent(url)
	var reg = new RegExp("(^|&|/?)" + key + "=([^&|/?]*)(&|/?|$)", 'i');
	var result = _url.substr(1).match(reg);
	return result ? result[2] : null;
}


//支付成功后跳转
function goToPaySuccess() {
	const url = "/pages/subPackageShop/paySuccess/paySuccess";
	redirectTo(url);
}

function redirectTo(url) {
	uni.redirectTo({
		url: url
	});
}

function navigateTo(url) {
	uni.navigateTo({
		url: url
	});
}

function navigateBack(n) {
	uni.navigateBack({
		delta: n
	});
}

function reLaunch(url) {
	uni.reLaunch({
		url: url
	});
}

function showErrorToast(msg) {
	uni.showToast({
		title: msg,
		image: '/static/images/icon_error.png'
	})
}

function showToastSuccess(msg) {
	uni.showToast({
		title: msg,
		icon: 'success',
		duration: 2000
	})
}

function showToastError(msg) {
	uni.showToast({
		title: msg,
		icon: 'none',
		duration: 3000
	})
}


function showWxLoading(msg) {
	uni.showLoading({
		title: msg || '加载中',
	})
}

function hideWxLoading() {
	uni.hideLoading()
}

function removeStorage(key) {
	uni.removeStorage({
		key: key
	});
}

function setNavigationBarTitle(title) {
	uni.setNavigationBarTitle({
		title: title
	})
}

function makePhoneCall(phone) {
	uni.makePhoneCall({
		phoneNumber: phone
	})
}

function mobileToStar(mobile) {
	var str = mobile.substring(0, 3) + "****" + mobile.substring(7, 11);
	return str;
}

function dateTimeStr(time) {
	var str = time.substring(5);
	return str;
}

function setBeforeDate(n) {
	var myDate = new Date()
	var year = myDate.getFullYear() - n
	return new Date(year, 0, 1).getTime()
}

function setAfterDate(n) {
	var myDate = new Date()
	var year = myDate.getFullYear() + n
	return new Date(year, 11, 31).getTime()
}

function strToObj(str) {
	let obj = {},
		_str = decodeURIComponent(str),
		_arr = _str.split('&');
	for (let i in _arr) {
		obj[_arr[i].split("=")[0]] = _arr[i].split("=")[1];
	}
	return obj;
}

function moneyFormat(money) {
	if (isNaN(money)) {
		return "0.00"
	}
	const formatMoney = (money / 100).toFixed(2)
	return formatMoney;
}

function timeToTime(time) {
	//2019-09-22 15:33:00
	var result = ""
	const dateTimeStamp = timeStamp(time)
	var result = ""
	var minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
	var hour = minute * 60;
	var day = hour * 24;
	var week = day * 7;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime(); //获取当前时间毫秒
	var diffValue = now - dateTimeStamp; //时间差
	if (diffValue < 0) {
		return;
	}
	var minC = diffValue // minute;  //计算时间差的分，时，天，周，月
	var hourC = diffValue / hour;
	var dayC = diffValue / day;
	var weekC = diffValue / week;
	var monthC = diffValue / month;

	var datetime = new Date();
	datetime.setTime(dateTimeStamp);
	var Nyear = datetime.getFullYear();
	var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
	var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
	var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
	var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
	var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();

	var nowDay = new Date().getDate();
	var day = new Date(dateTimeStamp).getDate();
	var num = nowDay - day
	if (num == 0) {
		result = "今天" + "  " + Nhour + ":" + Nminute
	} else if (num == 1) {
		result = "昨天" + "  " + Nhour + ":" + Nminute
	} else if (num == -29 || num == -30 || num == -27 || num == -28) {
		result = "昨天" + "  " + Nhour + ":" + Nminute
	} else {
		result = Nyear + "-" + Nmonth + "-" + Ndate + "  " + Nhour + ":" + Nminute
	}
	// if (monthC >= 12) {
	// 	result = Nyear + "-" + Nmonth + "-" + Ndate + "  " + Nhour + ":" + Nminute
	// } else if (monthC >= 1 && monthC < 12) {
	// 	result = Nyear + "-" + Nmonth + "-" + Ndate + "  " + Nhour + ":" + Nminute
	// } else if (weekC >= 1 && weekC <= 3) {
	// 	result = Nyear + "-" + Nmonth + "-" + Ndate + "  " + Nhour + ":" + Nminute
	// } else if (dayC >= 1 && dayC <= 30) {
	// 	if (dayC == 1) {
	// 		result = "昨天" + "  " + Nhour + ":" + Nminute
	// 	} else {
	// 		result = Nyear + "-" + Nmonth + "-" + Ndate + "  " + Nhour + ":" + Nminute
	// 	}
	// } else if (hourC >= 1 && hourC <= 24) {
	// 	var nowDay = new Date().getDate();
	// 	var day = new Date(dateTimeStamp).getDate();
	// 	if (nowDay == day) {
	// 		result = "今天" + "  " + Nhour + ":" + Nminute
	// 	} else {
	// 		result = "昨天" + "  " + Nhour + ":" + Nminute
	// 	}
	// } else if (minC >= 1 && minC <= 59) {
	// 	result = "今天" + "  " + Nhour + ":" + Nminute
	// } else if (diffValue >= 0 && diffValue <= minute) {
	// 	result = "今天" + "  " + Nhour + ":" + Nminute
	// } else {
	// 	var nowDay = new Date().getDate();
	// 	var day = new Date(dateTimeStamp).getDate();
	// 	if (nowDay == day) {
	// 		result = "今天" + "  " + Nhour + ":" + Nminute
	// 	} else {
	// 		result = Nyear + "-" + Nmonth + "-" + Ndate + "  " + Nhour + ":" + Nminute
	// 	}
	// }
	return result;
}


function timeago(dateTimeStamp) { //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
	var result = ""
	// console.log("================================",dateTimeStamp)
	var minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
	var hour = minute * 60;
	var day = hour * 24;
	var week = day * 7;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime(); //获取当前时间毫秒
	// console.log("now=", now)
	var diffValue = now - dateTimeStamp; //时间差
	// console.log("diffValue=", diffValue)
	if (diffValue < 0) {
		return;
	}
	var minC = diffValue / minute; //计算时间差的分，时，天，周，月
	var hourC = diffValue / hour;
	var dayC = diffValue / day;
	var weekC = diffValue / week;
	var monthC = diffValue / month;
	// console.log("minC==", minC)
	// console.log("hourC==", hourC)
	// console.log("dayC==", dayC)
	// console.log("weekC==", weekC)
	// console.log("monthC==", monthC)



	if (monthC >= 12) {
		result = " " + parseInt(monthC / 12) + "年前"
	} else if (monthC >= 1 && monthC < 12) {
		result = " " + parseInt(monthC) + "月前"
	} else if (weekC >= 1 && weekC <= 3) {
		result = " " + parseInt(weekC) + "周前"
	} else if (dayC >= 1 && dayC <= 30) {
		result = " " + parseInt(dayC) + "天前"
	} else if (hourC >= 1 && hourC <= 23) {
		result = " " + parseInt(hourC) + "小时前"
	} else if (minC >= 1 && minC <= 59) {
		result = " " + parseInt(minC) + "分钟前"
	} else if (diffValue >= 0 && diffValue <= minute) {
		result = "刚刚"
	} else {
		var datetime = new Date();
		datetime.setTime(dateTimeStamp);
		var Nyear = datetime.getFullYear();
		var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
		var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
		var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
		var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
		var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
		result = Nyear + "-" + Nmonth + "-" + Ndate
	}
	return result;
}


function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};



const util = {
	formatTime,
	timeStamp,
	getQueryString,
	goToPaySuccess,
	redirectTo,
	navigateTo,
	navigateBack,
	reLaunch,
	showErrorToast,
	showToastSuccess,
	showToastError,
	showWxLoading,
	hideWxLoading,
	removeStorage,
	mobileToStar,
	dateTimeStr,
	setNavigationBarTitle,
	makePhoneCall,
	timeToTime,
	getProvider,
	checkSession,
	login,
	getWxSetting,
	openWxSetting,
	setWxAuthorize,
	chooseWxLocation,

	getSetting,
	getUserInfo,
	chooseImage,
	uploadFile,
	getLocation,
	setBeforeDate,
	setAfterDate,
	timeago,
	strToObj,
	moneyFormat,

	formatLocation,
	dateUtils
}
export default util
