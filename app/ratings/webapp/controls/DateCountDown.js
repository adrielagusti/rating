sap.ui.define([
	"sap/m/ObjectStatus",
	"sap/m/ObjectStatusRenderer"
], function (BaseControl, BaseRenderer) {
	"use strict";

	var oControl = BaseControl.extend("blackseeds.ratings.controls.DateCountDown", {
		metadata: {
			library: "blackseeds.ratings",
			properties: {
				date: {
					type: "object",
					group: "Data",
					defaultValue: null
				},
				isFuture: {
					type: "boolean",
					group: "Data",
					defaultValue: true
				},
				criticalTimeInHours: {
					type: "int",
					group: "Data",
					defaultValue: 48
				},
				warningTimeInHours: {
					type: "int",
					group: "Data",
					defaultValue: 24
				},
			},
		},
		renderer: BaseRenderer
	});

	sap.ui.core.EnabledPropagator.call(oControl.prototype);

	/* =========================================================== */
	/*                  begin: Lifecycle functions                 */
	/* =========================================================== */

	oControl.prototype.init = function () {
		//call the parent init method
		if (BaseControl.prototype.init) {
			BaseControl.prototype.init.apply(this, arguments);
		}
		this._interval = setInterval(() => this._setDateCountDown(), 1000);
	};

	oControl.prototype.exit = function () {
		clearInterval(this._interval);
		//call the parent exit method
		if (BaseControl.prototype.exit) {
			BaseControl.prototype.exit.apply(this, arguments);
		}
	};

	/* =========================================================== */
	/*                   end: Lifecycle functions                  */
	/* =========================================================== */

	/* =========================================================== */
	/*                    begin: public functions                  */
	/* =========================================================== */

	/* =========================================================== */
	/*                     end: public functions                   */
	/* =========================================================== */

	/* =========================================================== */
	/*                      begin: event handlers                  */
	/* =========================================================== */

	/* =========================================================== */
	/*                      end: event handlers                    */
	/* =========================================================== */

	/* =========================================================== */
	/*                      begin: private functions               */
	/* =========================================================== */

	oControl.prototype._setDateCountDown = function () {
		var bIsFuture = this.getIsFuture(),
			oDate = this.getDate();

		if (!oDate) {
			this.setText("");
			this.setState(sap.ui.core.ValueState.None);
			return;
		}
		
		var oStartDate = bIsFuture ? new Date() : oDate,
			oEndDate = bIsFuture ? oDate : new Date(),
			oTimeMeasures = this._getTimeMeasures(oStartDate, oEndDate);
			// debugger;
		this.setText(oTimeMeasures.days + "d " + oTimeMeasures.hours + "h " + oTimeMeasures.minutes + "m " + oTimeMeasures.seconds + "s");

		var iTotalHours = (oTimeMeasures.days * 24) + oTimeMeasures.hours;
		if (iTotalHours > this.getCriticalTimeInHours()) {
			this.setState(sap.ui.core.ValueState.Success);
			// this.setState(bIsFuture ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.Error);
		} else if (iTotalHours > this.getWarningTimeInHours()) {
			this.setState(sap.ui.core.ValueState.Success);
		} else {
			// this.setState(bIsFuture ? sap.ui.core.ValueState.Error : sap.ui.core.ValueState.Success);
			this.setState(sap.ui.core.ValueState.Success);
		}
	};

	oControl.prototype._getTimeMeasures = function (startDate, endDate) {
		// debugger;
		var delta = Math.abs(endDate - startDate) / 1000;
		// calculate (and subtract) whole days
		var days = Math.floor(delta / 86400);
		delta -= days * 86400;
		// calculate (and subtract) whole hours
		var hours = Math.floor(delta / 3600) % 24;
		delta -= hours * 3600;
		// calculate (and subtract) whole minutes
		var minutes = Math.floor(delta / 60) % 60;
		delta -= minutes * 60;
		// calculate (and subtract) whole seconds
		var seconds = delta % 60;
		return {
			days: days,
			hours: hours,
			minutes: minutes,
			seconds: seconds.toFixed(0)
		};
	};

	/* =========================================================== */
	/*                      end: private functions                 */
	/* =========================================================== */

	/* =========================================================== */
	/*                   begin: getters and setters                */
	/* =========================================================== */

	oControl.prototype.getDate = function () {
		return this.getProperty("date");
	};

	oControl.prototype.setDate = function (sValue) {
		this.setProperty("date", sValue);
	};

	oControl.prototype.getIsFuture = function () {
		return this.getProperty("isFuture");
	};

	oControl.prototype.setIsFuture = function (sValue) {
		this.setProperty("isFuture", sValue);
	};

	oControl.prototype.getCriticalTimeInHours = function () {
		return this.getProperty("criticalTimeInHours");
	};

	oControl.prototype.setCriticalTimeInHours = function (sValue) {
		this.setProperty("criticalTimeInHours", sValue);
	};

	oControl.prototype.getWarningTimeInHours = function () {
		return this.getProperty("warningTimeInHours");
	};

	oControl.prototype.setWarningTimeInHours = function (sValue) {
		this.setProperty("warningTimeInHours", sValue);
	};

	/* =========================================================== */
	/*                   end: getters and setters                  */
	/* =========================================================== */

	/* =========================================================== */
	/*                     Resize & Drag logic                     */
	/* =========================================================== */

	return oControl;
});