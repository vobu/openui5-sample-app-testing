sap.ui.define([
	"sap/ui/core/util/MockServer"
], function (MockServer) {
	"use strict";

	/**
	 * custom mockserver, extended for convenience
	 *
	 * @extends sap.ui.core.util.MockServer
	 */
	return {

		/**
		 * mockserver instance
		 * @var {object} oMockserver
		 */

		/**
		 * mockserver creation
		 * - finds manifest.json and attaches to configured "main service" datasource there
		 * - reads metadata.xml from /webapp/test
		 * - set response time to immediate or otherwise specified ms in URL via "mockserverDelay=<n>"
		 * - sets base mockdata folder to /webapp/test/mockdata
		 * - potential additonal logging activated via URL parameter sap-ui-mockserver-debug=true
		 * @param oParameters
		 * @returns {sap.ui.core.util.MockServer} an initialized and started mockserver
		 */
		init: function (oParameters) {
			var sJsonFilesUrl = jQuery.sap.getModulePath("sap/ui/demo/todo/test/mockdata"),
				sManifestUrl = jQuery.sap.getModulePath("sap/ui/demo/todo/manifest", ".json"),
				oManifest = jQuery.sap.syncGetJSON(sManifestUrl).data,
				oMainDataSource = oManifest["sap.app"].dataSources.mainService,
				// ensure there is a trailing slash
				sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + "/",
				sMetadataUrl = jQuery.sap.getModulePath("sap/ui/demo/todo/test/metadata", ".xml");

			// init root URI
			this.oMockServer = new MockServer({
				rootUri: sMockServerUrl
			});

			// configure mock server with a potential delay
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: (oParameters.get("sap-ui-mockserver-delay") || 0)
			});

			// load local mock data (if there's any)
			this.oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sJsonFilesUrl,
				bGenerateMissingMockData: true
			});

			// attach pre-processing- and post-processing-actions
			if (oParameters.get("sap-ui-mockserver-debug") === "true") {
				// Trace requests
				Object.keys(MockServer.HTTPMETHOD).forEach(function (sMethodName) {
					var sMethod = MockServer.HTTPMETHOD[sMethodName];
					this.oMockServer.attachBefore(sMethod, function (oEvent) {
						var oXhr = oEvent.getParameters().oXhr;
						console.log("MockServer::before", sMethod, oXhr.url, oXhr);
					});
					this.oMockServer.attachAfter(sMethod, function (oEvent) {
						var oXhr = oEvent.getParameters().oXhr;
						console.log("MockServer::after", sMethod, oXhr.url, oXhr);
					});
				}.bind(this));
			}

			this.oMockServer.start();

			jQuery.sap.log.debug("MockServer started w/\n" +
				"   baseURL: " + sMockServerUrl + "\n" +
				"   metadata from " + sMetadataUrl + "\n" +
				"   mockdata dir: " + sJsonFilesUrl);

			// return this.oMockServer;
			return this;
		},

		shutdown: function () {
			this.oMockServer.stop();
			this.oMockServer = null;
		}
	};

});
