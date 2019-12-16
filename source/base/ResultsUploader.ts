/* Integration through qmetry.properties file */
import * as fs from "fs-extra";
import * as path from "path";
import * as request from "request";
import {
  QMETRY_ENABLED,
  INTEGRATION_TYPE,
  ON_PREMISE,
  URL,
  API_KEY,
  USERNAME,
  PASSWORD,
  TEST_RUN_NAME,
  PLATFORM,
  LABELS,
  VERSION,
  COMPONENTS,
  SPRINT,
  COMMENT,
  TEST_RUN_KEY,
  JIRA_FIELS,
  CYCLE_IDS,
  PLATFORM_ID,
  TEST_SUITE_ID,
  PROJECT_ID,
  REALEASE_ID,
  BUILD_ID,
  ZipMaker,
  ATTACH_FILE,
  ENTITY_TYPE,
  TEST_SUITE_NAME,
  TEST_ASSET_HIERARCHY,
  TEST_CASE_UPDATE_LEVEL,
  TEST_CYCLE_TO_REUSE,
  ENVIRONMENT,
  BUILD,
  TEST_CYCLE_LABELS,
  TEST_CYCLE_COMPONENTS,
  TEST_CYCLE_PRIORITY,
  TEST_CYCLE_STATUS,
  TEST_CYCLE_SPRINTID,
  TEST_CYCLE_FIXVERSIONID,
  TEST_CYCLE_SUMMARY,
  TEST_CASE_LABELS,
  TEST_CASE_COMPONENTS,
  TEST_CASE_PRIORITY,
  TEST_CASE_STATUS,
  TEST_CASE_SPRINTID,
  TEST_CASE_FIXVERSIONID,
	TEST_SUITE_FIELDS,
	TEST_CASE_FIELDS

} from "./utils";
import { ConfigurationManager } from "./ConfigurationManager";

export let extraFieldMap = {};
export let integrationProperties = ConfigurationManager.getIntegrationBundle();

function uploadResults(filePath, callback) {
  console.log("<<<<<<<<<<<<<<<<<<<<< Uploading Results >>>>>>>>>>>>>>>>");
  var option_new;
	var start = new Date().getTime();
  if (!ON_PREMISE && INTEGRATION_TYPE.toString().toLowerCase() === "qtm4j") {
    // FOR QTM4J CLOUD
    option_new = {
      method: "POST",
      url: URL,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        apiKey: API_KEY,
        format: 'qas/json',
        isZip: true
      },
      json: true
    };
    option_new["body"]["testAssetHierarchy"] = TEST_ASSET_HIERARCHY;//"TestCase-TestStep";
    option_new["body"]["testCaseUpdateLevel"] = TEST_CASE_UPDATE_LEVEL;//1;
    // delete extraFieldMap['testRunName'];
    option_new = getExtraFieldMap(option_new);

    console.log(
      "Requesting With:::" +
      INTEGRATION_TYPE +
      "::Cloud" +
      JSON.stringify(option_new)
    );
    try {
      // url will not get for qtm4j cloud
      request(option_new, function requestTO(error, response, body) {
        console.log(
          "Upload Result Response::QTM4J::Cloud:::" + JSON.stringify(response)
        );
        if (response.body.isSuccess) {
          doCloudCall(filePath, response, callback);
        } else {
          callback({ success: false, errMessage: response.body.errorMessage });
        }
      });
    } catch (e) {
      callback({ success: false, errMessage: e });
    }
  } else if (!ON_PREMISE && INTEGRATION_TYPE.toString().toLowerCase() === "qtm4j4x") {
    // FOR QTM4J CLOUD
    option_new = {
      method: "POST",
      url: URL,
      headers: {
        "Content-Type": "application/json",
        apiKey: API_KEY
      },
      body: {
        format: 'qaf',
        isZip: true
      },
      json: true
    };
    // delete extraFieldMap['testRunName'];
    option_new = getExtraFieldMap(option_new);

    console.log(
      "Requesting With:::" +
      INTEGRATION_TYPE +
      "::Cloud" +
      JSON.stringify(option_new)
    );
    try {
      // url will not get for qtm4j cloud
      request(option_new, function requestTO(error, response, body) {
        console.log(
          "Upload Result Response::QTM4J4X::Cloud:::" + JSON.stringify(response)
        );
        if (response && response.body && response.body.trackingId) {
          doCloudCall(filePath, response, callback);
        } else {
          callback({ success: false, errMessage: response.body.errorMessage });
        }
      });
    } catch (e) {
      callback({ success: false, errMessage: e });
    }
  } else {
    //FOR QTM4J server and QTM(CLound/Server)

    console.log("Uploading file name ::" + filePath);
    if (INTEGRATION_TYPE.toString().toLowerCase() === "qtm") {
      option_new = {
        method: "POST",
        url: URL,
        headers: {
          apikey: API_KEY,
          scope: "default",
          accept: "application/json"
        },
        formData: {
          file: {
            value: fs.createReadStream(filePath),
            options: {
              filename: path.basename(filePath),
              contentType: null
            }
          },
          entityType: 'QAF'
        }
      };
    } else {
      //for QTM4J Server
      let authorization_value = encodeBase64(USERNAME, PASSWORD);

      option_new = {
        method: "POST",
        url: URL,
        headers: {
          Authorization: "Basic " + authorization_value
        },
        formData: {
          file: {
            value: fs.createReadStream(filePath),
            options: { filename: path.basename(filePath) }
          },
          apiKey: API_KEY,
          format: 'qas/json'
        }
      };
    }

    //options are created, now need to make a call
    option_new["formData"]["testAssetHierarchy"] = TEST_ASSET_HIERARCHY;//"TestCase-TestStep";
    option_new["formData"]["testCaseUpdateLevel"] = TEST_CASE_UPDATE_LEVEL;//1;
    option_new = getExtraFieldMap(option_new);
    console.log(
      "Requesting With:::" +
      INTEGRATION_TYPE +
      "::Server" +
      JSON.stringify(option_new)
    );
    try {
      request(option_new, function requestTO(error, response, body) {
        var end = new Date().getTime();
        var time = end - start;
        if (!response || response.statusCode !== 200) {
          callback({
            success: false,
            errMessage:
              "Something Went Wrong, Please Check Configuration(URL, Credentials etc...)",
            executionTime: time
          });
        }
        let parseBody = JSON.parse(body);
        deleteZip(filePath);
        console.log(
          "Upload Result Response:::" +
          INTEGRATION_TYPE +
          "::Server" +
          JSON.stringify(parseBody)
        );
      });
    } catch (e) {
      console.log("error:" + e);
      callback({ success: false, errMessage: e });
    }
  }
}

export function encodeBase64(username, pwd) {
  return Buffer.from(username + ":" + pwd).toString("base64");
}

function getExtraFieldMap(option_new) {
	if (INTEGRATION_TYPE.toString().toLowerCase() === "qtm4j4x") {
		nonRequiredRequest4xParam();
	} else {
		nonRequiredRequestParam();
	}

  if (!ON_PREMISE && INTEGRATION_TYPE.toString().toLowerCase() === "qtm4j" || !ON_PREMISE && INTEGRATION_TYPE.toString().toLowerCase() === "qtm4j4x") {
    Object.keys(extraFieldMap).forEach(function (key) {
      var val = extraFieldMap[key];
      if (val !== "" && val !== undefined && val !== null && val !== 0) {
        option_new["body"][key] = val;
      }
    });
  } else {
    Object.keys(extraFieldMap).forEach(function (key) {
      var val = extraFieldMap[key];
      if (val !== "" && val !== undefined && val !== null && val !== 0) {
        option_new["formData"][key] = val;
      }
    });
  }

  return option_new;
}

function doCloudCall(filePath, response, callback) {
  console.log("IN CLOUD > ::: for " + response.body.url);
  var start = new Date().getTime();
  var option_new = {
    method: "PUT",
    url: response.body.url,
    headers: {
      "Content-Type": "multipart/form-data"
    },
    json: false,
    enconding: null,
    body: fs.readFileSync(filePath)
  };
  try {
    console.log(" OPTION <<<<<<<<<<<<<<" + JSON.stringify(option_new));
    request(option_new, function requestTO(error, response, body) {
      console.log("response :: %%%%%%%%%%%%%%%" + JSON.stringify(response));
      if (error) {
        console.log("ERROR :: %%%%%%%%%%%%%%%" + JSON.stringify(error));
        console.log("IN ERROR ::");
        callback({ success: false, errMessage: error }); // TODO:
      }
      var end = new Date().getTime();
      var time = end - start;
      deleteZip(filePath);
      callback({
        success: true,
        statusCode: response.statusCode,
        executionTime: time
      });
    });
  } catch (e) {
    callback({ success: false, errMessage: e });
  }
}



function nonRequiredRequestParam() {
  extraFieldMap['testAssetHierarchy'] = TEST_ASSET_HIERARCHY;
  extraFieldMap['testCaseUpdateLevel'] = TEST_CASE_UPDATE_LEVEL;
  extraFieldMap["testRunName"] = TEST_RUN_NAME;
  extraFieldMap["platform"] = PLATFORM;
  extraFieldMap["labels"] = LABELS;
  extraFieldMap["versions"] = VERSION;
  extraFieldMap["components"] = COMPONENTS;
  extraFieldMap["sprint"] = SPRINT;
  extraFieldMap["comment"] = COMMENT;
  extraFieldMap["testRunKey"] = TEST_RUN_KEY;
  extraFieldMap["attachFile"] = ATTACH_FILE.toString();
  if (INTEGRATION_TYPE.toString().toLowerCase() === "qtm4j" && !ON_PREMISE) {
    exports.extraFieldMap["JIRAFields"] = JSON.parse(JIRA_FIELS.toString());
  } else {
    exports.extraFieldMap["JIRAFields"] = JIRA_FIELS;
  }
  extraFieldMap["cycleID"] = CYCLE_IDS;
  extraFieldMap["platformID"] = PLATFORM_ID;
  extraFieldMap["testsuiteId"] = TEST_SUITE_ID;
  extraFieldMap["projectID"] = PROJECT_ID;
  extraFieldMap["releaseID"] = REALEASE_ID;
  extraFieldMap["buildID"] = BUILD_ID;
  extraFieldMap["testsuiteName"] = TEST_SUITE_NAME;

	extraFieldMap['testcase_fields'] = TEST_CASE_FIELDS;
	extraFieldMap['testsuite_fields'] = TEST_SUITE_FIELDS;


	extraFieldMap['testcase_fields'] = extraFieldMap['testcase_fields'].replace(/\"\[/g,'[').replace(/\]"/g,']');
	extraFieldMap['testsuite_fields'] = extraFieldMap['testsuite_fields'].replace(/\"\[/g,'[').replace(/\]"/g,']');




}

function checkValueIsBankOrNot(val) {

	if (val !== '' && val !== undefined && val !== null && val !== 0) {
			return val;
	} else {
			return '';
	}

}

function nonRequiredRequest4xParam() {

	extraFieldMap["testCycleToReuse"] = TEST_CYCLE_TO_REUSE;
	extraFieldMap["environment"] = ENVIRONMENT;
	extraFieldMap["build"] = BUILD;
	extraFieldMap["attachFile"] = ATTACH_FILE.toString();
	extraFieldMap["fields"] = {
		'testCycle': {
			'labels': checkValueIsBankOrNot(TEST_CYCLE_LABELS) !== '' ? TEST_CYCLE_LABELS.split(',') : [],
			'components': checkValueIsBankOrNot(TEST_CYCLE_COMPONENTS) ? TEST_CYCLE_COMPONENTS.split(',') : [],
			'priority':  checkValueIsBankOrNot(TEST_CYCLE_PRIORITY),
			'status': checkValueIsBankOrNot(TEST_CYCLE_STATUS),
			'sprintId':  checkValueIsBankOrNot(TEST_CYCLE_SPRINTID),
			'fixVersionId':  checkValueIsBankOrNot(TEST_CYCLE_FIXVERSIONID),
			'summary':  checkValueIsBankOrNot(TEST_CYCLE_SUMMARY)
		},
		'testCase': {
			'labels': checkValueIsBankOrNot(TEST_CASE_LABELS) !== '' ? TEST_CASE_LABELS.split(',') : [],
			'components': checkValueIsBankOrNot(TEST_CASE_COMPONENTS) !== '' ? TEST_CASE_COMPONENTS.split(',') : [],
			'priority':  checkValueIsBankOrNot(TEST_CASE_PRIORITY),
			'status':  checkValueIsBankOrNot(TEST_CASE_STATUS),
			'sprintId':  checkValueIsBankOrNot(TEST_CASE_SPRINTID),
			'fixVersionId':  checkValueIsBankOrNot(TEST_CASE_FIXVERSIONID)
		}
	};

}

function deleteZip(filePath) {
  let isDebug: boolean = integrationProperties.get("automation.qmetry.debug");
  if (!isDebug && fs.exists(filePath)) {
    console.log("deleting Zip success....😲" + filePath);
    fs.unlinkSync(filePath);
  }
}
if (QMETRY_ENABLED && QMETRY_ENABLED === true) {
  ZipMaker(data => {
    if (data.success) {
      uploadResults(data.filePath, data => {
        console.log(JSON.stringify(data));
      });
    }
  });
} else {
  console.log("Not Uploading Results as flag automation.qmetry.enabled is not set")
}
