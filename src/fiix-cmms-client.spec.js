
var fiixCmmsClient = new FiixCmmsClient();
fiixCmmsClient.setBaseUri( '<Your sandbox tenant URL>/api/' );
fiixCmmsClient.setAppKey('Your Application Key');
fiixCmmsClient.setAuthToken('Your Access Key');
fiixCmmsClient.setPKey('Your API Secret');


describe("Test your connection is working by using the Ping RPC", function () {
    it('should invoke the Ping rpc', function () {
        const result = fiixCmmsClient.rpc({
            "name": "Ping",
        })
        expect(result._maCn).toContain('RpcResponse');
        // console.log(result);
    })
})

describe("Test a sample CRUD API call", function () {
    it('should invoke the Find Asset operation', function() {
        const result = fiixCmmsClient.find(
            {
                "className": "Asset",
                "fields": "id, strName"
            })
        expect(result.objects[0].className).toContain('Asset');
    })
})


describe("Test the File Upload Call", function () {
    it('should invoke the File Upload operation', function() {
        //Provide the logic here to retrieve the files to be uploaded. The existing test case will upload an empty document
        const assetUploadFile = "";
        const woUploadFile = "";
        var descriptionArray = [{
            sourceInfo : "ASSET_INFO",
            sourceIdString: "512",
            fieldName : "assetUploadFile"
        },
            {
                sourceInfo : "WORK_ORDER_INFO",
                sourceIdString: "1",
                fieldName : "workUploadFile"
            },
        ];

        const result = fiixCmmsClient.uploadFile(
            {
                "descriptions" : descriptionArray,
                "assetUploadFile": assetUploadFile,
                "workUploadFile": woUploadFile
            });
        console.log("Result is "+result);
        expect(result._maCn).toContain('UploadResponse');
    })
})