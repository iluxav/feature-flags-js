window.jsff = (function (window, $, userSettings, undefined) {
	'use strict';
	//Default settings
	var _settings = {
		useLocalStorageOverride: false,
		remoteDataSource: null
	};
	var onChangeCallbacks = [];
	updateSettings(userSettings);
	var _data = getFromStorage() || getFromRemote();
	notifyChange();
	updateOverrides();

	function getFromRemote() {
		var jsonData = {};
		if (_settings.remoteDataSource) {
			$.ajax({
				url: _settings.remoteDataSource,
				dataType: 'json',
				success: function (json) {
					jsonData = json;
				},
				async: false
			});
		}
		return jsonData;
	}

	function getFromStorage() {
		if (localStorage && _settings.useLocalStorageOverride)
			return JSON.parse(localStorage.getItem('ffData'));
		return null;
	}

	function updateOverrides() {
		if (localStorage && _settings.useLocalStorageOverride) {
			clearLocalStorage();
			localStorage.setItem('ffData', JSON.stringify(_data));
		}
	}

	function clearLocalStorage() {
		if (localStorage)
			localStorage.removeItem('ffData');
	}

	function updateSettings(obj) {
		if (obj)
			_settings = $.extend({}, _settings, obj);
		return _settings;
	}

	function onChange(clb) {
		if (typeof clb === 'function')
			onChangeCallbacks.push(clb);
	}

	function notifyChange() {
		$.each(onChangeCallbacks, function (i, clb) {
			clb(_data);
		});
	}

	var getData = function () {
		return _data;
	};
	var setData = function (data) {
		_data = data;
		if (_settings.useLocalStorageOverride) {
			updateOverrides();
		}
		notifyChange();
	};
	var enable = function (flagName) {
		if (_data[flagName]) {
			_data[flagName].active = true;
			updateOverrides()
			notifyChange();
		}
	};
	var disable = function (flagName) {
		flagName = flagName.trim();
		if (_data[flagName]) {
			_data[flagName].active = false;
			updateOverrides()
			notifyChange();
		}
	};
	var flags = function (flagNames) {
		if (flagNames.indexOf(",") > -1)
			flagNames = flagNames.split(",");
		if (typeof flagNames === 'object' && flagNames.length > 0)
			return areActive(flagNames);
		return isActive(flagNames);
	};

	var areActive = function (flagNames) {
		var areActiveResult = true;
		$.each(flagNames, function (i, fName) {
			areActiveResult = areActiveResult && isActive(fName);
		})
		return areActiveResult;
	};

	var isActive = function (flagName) {
		if (flagName.indexOf(".") > -1)
			return isActiveWithParents(flagName);
		return isOn(flagName);
	};
	var isActiveWithParents = function (flagName) {
		var parents = flagName.split(".");
		var all = true;
		$.each(parents, function (i) {
			var nm = parents.slice(0, i + 1).join(".");
			all = all && isOn(nm);
		})
		return all;
	};

	var isOn = function (flagName) {
		flagName = flagName.trim();
		var flip = (flagName.substring(0, 1) === "!");
		flagName = flagName.replace('!', '');

		var flag = _data[flagName];
		return flag ? (flip ? !flag.active : flag.active) : false;
	};

	var areOn = function (flagName) {

	};

	return {
		setData: setData,
		getData: getData,
		enable: enable,
		disable: disable,
		clearOverrides: clearLocalStorage,
		flags: flags,
		areOn: areOn,
		settings: updateSettings,
		onChange: onChange
	};
})(window, jQuery, {
	useLocalStorageOverride: false,
	remoteDataSource: '/features/flags.json'
});
