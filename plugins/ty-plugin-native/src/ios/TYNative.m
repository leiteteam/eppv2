/********* TYNative.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>
#import "DSUserLoginRequest.h"
#import "DSUserLoginResponse.h"
#import "DataStringCatche.h"
#import "DSWebRequest.h"
#import "QDWebParams.h"
//#import "QDBusiness.h"
//#import "QDDeviceManager.h"
//#import "QDBaseAutoNavBarNavigationController.h"
#import "MainViewController.h"
//#import "QDHFK_SignHolderVC.h"
@interface TYNative : CDVPlugin {
    // Member variables go here.
    NSString  *_callbackId;
    NSMutableDictionary *_itemList;
}
//@property(nonatomic,strong)QDBusiness *qdBusiness;
- (void)coolMethod:(CDVInvokedUrlCommand*)command;

- (void)userLogin:(CDVInvokedUrlCommand *)command;
-(void)post:(CDVInvokedUrlCommand *)command;
-(void)get:(CDVInvokedUrlCommand *)command;

- (void)saveString:(CDVInvokedUrlCommand *)command;
- (void)getString:(CDVInvokedUrlCommand *)command;

-(void)push:(CDVInvokedUrlCommand *)cdCommand;
@end

@implementation TYNative

-(void)dealloc{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}
- (void)coolMethod:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* echo = [command.arguments objectAtIndex:0];
    
    if (echo != nil && [echo length] > 0) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:echo];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

#pragma mark - network
-(void)userLogin:(CDVInvokedUrlCommand *)command{
    __block CDVPluginResult* pluginResult = nil;
    NSDictionary* echo = [command.arguments objectAtIndex:0];
    
    if (echo != nil && echo.allKeys.count>0) {
        NSDictionary *reqDic = echo;
        NSString *username = reqDic[@"username"];
        NSString *password = reqDic[@"password"];
        // 登录
        DSUserLoginRequest *request = [[DSUserLoginRequest alloc] init];
        request.userCode = username;
        request.userName = username;
        request.password = password;
        
        NSDictionary *requestDict = [request requestData];
        
        
        AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
        manager.securityPolicy.allowInvalidCertificates = YES;
        manager.requestSerializer = [AFJSONRequestSerializer serializer];
        manager.responseSerializer = [AFHTTPResponseSerializer serializer];
        __weak TYNative *weakSelf = self;
        [manager POST:SERVER_ADDRESS parameters:requestDict success:^(AFHTTPRequestOperation *operation, id responseObject) {
            
            DSUserLoginResponse *response = [[DSUserLoginResponse alloc] init];
            [response ResponseData:responseObject];
            if (![response.actionReturnCode isEqualToString:@"000000"] || !response.isComplete)
            {// 失败
                pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:response.actionReturnMessage];
                [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            }
            else
            {// 成功
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:response.ACTION_INFOStr];
                [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            }
        } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"网路异常，请检查网路设置"];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }];
        
        
    }else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"传递参数错误(userLogin)"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}
-(void)uploadfileWithBase64String:(CDVInvokedUrlCommand *)command{
//    NSString *urlStr = @"http://10.8.3.138:8080/data/uploadDoc?t=1512440811434";
       __block CDVPluginResult* pluginResult = nil;
    NSDictionary* echo = [command.arguments objectAtIndex:0];
    
    if (echo != nil && echo.allKeys.count>0) {
          __weak TYNative *weakSelf = self;
        AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
        manager.responseSerializer = [AFHTTPResponseSerializer serializer];
        [manager POST:echo[@"url"] parameters:nil constructingBodyWithBlock:^(id<AFMultipartFormData> formData) {
            //上传的参数(上传图片，以文件流的格式)
            NSString *fileType=echo[@"fileType"];
            NSData *imagedata =  [[NSData alloc] initWithBase64EncodedString:echo[@"base64String"] options:0];
            [formData appendPartWithFileData:imagedata
                                        name:@"file"
                                    fileName:[NSString stringWithFormat:@"myfile%@",fileType]
                                    mimeType:@"multipart/form-data"];
        } success:^(NSURLSessionDataTask *task, id responseObject) {
            NSString *result = [[NSString alloc]initWithData:responseObject encoding:NSUTF8StringEncoding];
            NSLog(@"%@",result);
        } failure:^(NSURLSessionDataTask *task, NSError *error) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"网路异常，请检查网路设置"];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }];
    }else{
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"传递参数错误(userLogin)"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
  
}
-(void)post:(CDVInvokedUrlCommand *)command{
    __block CDVPluginResult* pluginResult = nil;
    NSDictionary* echo = [command.arguments objectAtIndex:0];
    if (echo != nil && echo.allKeys.count>0) {
        DSWebRequest *request = [[DSWebRequest alloc] init];
        request.actionName = echo[@"requestActionName"];
        request.sessionID = echo[@"sessionID"];
        request.userID = echo[@"userID"];
        request.actionInfoStr = echo[@"actionInfoStr"];
        NSDictionary *requestDict = [request requestData];
        
        AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
        manager.securityPolicy.allowInvalidCertificates = YES;
        manager.requestSerializer = [AFJSONRequestSerializer serializer];
        manager.responseSerializer = [AFHTTPResponseSerializer serializer];
        __weak TYNative *weakSelf = self;
        [manager POST:echo[@"url"] parameters:requestDict success:^(AFHTTPRequestOperation *operation, id responseObject) {
            
            QDWebParams *wp = [[QDWebParams alloc] init];
            [wp ResponseData:responseObject];
            
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:wp.responsejson];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
            NSLog(@"Httperror:%@%ld", error.localizedDescription, error.code);
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"网路异常，请检查网路设置"];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }];
    }else{
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"传递参数错误(post)"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
    
}

-(void)get:(CDVInvokedUrlCommand *)command{
    __block CDVPluginResult* pluginResult = nil;
    NSDictionary* echo = [command.arguments objectAtIndex:0];
    if (echo != nil && echo.allKeys.count>0) {
        
    }else{
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"传递参数错误(post)"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
    DSWebRequest *request = [[DSWebRequest alloc] init];
    request.actionName = echo[@"requestActionName"];
    request.sessionID = echo[@"sessionID"];
    request.userID = echo[@"userID"];
    request.actionInfoStr = echo[@"actionInfoStr"];
    NSDictionary *requestDict = [request requestData];
    
    AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
    manager.securityPolicy.allowInvalidCertificates = YES;
    manager.requestSerializer = [AFJSONRequestSerializer serializer];
    manager.responseSerializer = [AFHTTPResponseSerializer serializer];
    __weak TYNative *weakSelf = self;
    [manager GET:echo[@"url"] parameters:requestDict success:^(AFHTTPRequestOperation *operation, id responseObject) {
        
        QDWebParams *wp = [[QDWebParams alloc] init];
        [wp ResponseData:responseObject];
        
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:wp.responsejson];
        [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        NSLog(@"Httperror:%@%ld", error.localizedDescription, error.code);
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"网路异常，请检查网路设置"];
        [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}



#pragma mark - database
- (void)saveString:(CDVInvokedUrlCommand *)command{
    CDVPluginResult* pluginResult = nil;
    NSDictionary* echo = [command.arguments objectAtIndex:0];
    
    if (echo != nil && echo.allKeys.count>0) {
        [DataStringCatche saveStringWidthString:echo[@"data"] forKey:echo[@"key"]];
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
- (void)getString:(CDVInvokedUrlCommand *)command{
    CDVPluginResult* pluginResult = nil;
    NSString* echo = [command.arguments objectAtIndex:0];
    
    if (echo != nil && [echo length] > 0) {
        NSString *data = [DataStringCatche getStringforKey:echo];
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:data];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

#pragma mark - device
-(void)push:(CDVInvokedUrlCommand *)cdCommand{
    
    __block CDVPluginResult* pluginResult = nil;
    NSDictionary* echo = [cdCommand.arguments objectAtIndex:0];
    if (echo != nil && echo.allKeys.count>0) {
        
        
//        NSString *command = echo[@"command"];
//        if ([command isEqualToString:@"emallPay"]                   //消费
//            || [command isEqualToString:@"nativeCardBalanceView"]   //查询余额
//            || [command isEqualToString:@"openPrint"]                 //打印
//            || [command isEqualToString:@"swipeBankcardNo"]         //刷卡取号
//            || [command isEqualToString:@"cashPrint"]
//            || [command isEqualToString:@"otherPrint"]
//            )
//        {
//            NSString *emallAction = nil;
//            if ([command isEqualToString:@"emallPay"])
//            {//消费
//                emallAction = @"0";
//            }
//            else if ([command isEqualToString:@"nativeCardBalanceView"])
//            {//查询余额
//                emallAction = @"1";
//            }
//            else if ([command isEqualToString:@"openPrint"])
//            {//打印
//                emallAction = @"2";
//            }
//            else if ([command isEqualToString:@"swipeBankcardNo"])
//            {//刷卡取号
//                emallAction = @"3";
//            }
//            else if ([command isEqualToString:@"cashPrint"])
//            {//现金打印，微信支付宝支付打印
//                emallAction = @"4";
//            }
//            else if ([command isEqualToString:@"otherPrint"])
//            {//现金打印，微信支付宝支付补打印
//                emallAction = @"5";
//            }
//            NSString *orderInfoStr = echo[@"commandData"];
//            NSMutableDictionary *tempDic = [NSMutableDictionary dictionaryWithDictionary:[orderInfoStr objectFromJSONString]];
//            NSString *channelType = [tempDic objectForKey:@"channelType"];
//
//            // token
//            [QDLogger setToken:[tempDic valueForKey:@"token"]];
//
//            if (tempDic.count == 0)
//            {
//                // [CustomPickerView showActionInfoTips:@"抱歉，服务故障，请联系客服(JSErr)" duration:4.5f];
//            }
//            else if ([command isEqualToString:@"emallPay"] && [channelType isEqualToString:@"0003"])
//            {//UPOP代扣
//            }
//            else if ([command isEqualToString:@"emallPay"] && [channelType isEqualToString:@"0005"])
//            {//无卡支付
//            }
//            else if ([command isEqualToString:@"emallPay"] && [channelType isEqualToString:@"0007"])
//            {//通联卡卡转账
//            }
//            else if ([command isEqualToString:@"emallPay"] && [channelType isEqualToString:@"0017"])
//            {//银联无卡插件支付通道(全渠道无卡手机控件支付)[原来不是0005支付通道么，搞不懂]
//
//                //            [QDProgressView showProgress];
//                //            dispatch_async(dispatch_get_global_queue(0, 0), ^{
//                //                QDUpNoCard *upNoCard = [[QDUpNoCard alloc] init];
//                //                [upNoCard prepareTN:tempDic finished:^(BOOL success, NSString *tnOrErrMsg) {
//                //                    dispatch_async(dispatch_get_main_queue(), ^{
//                //                        [QDProgressView closeProgress];
//                //
//                //                        if (!success){
//                //                            [self showErrorMsg:tnOrErrMsg];
//                //                            return;
//                //                        }
//                //
//                //                        if(![upNoCard startUPPay:tnOrErrMsg viewController:self])
//                //                        {
//                //                            [self showErrorMsg:@"银联插件启动失败！"];
//                //                        }
//                //                    });
//                //                }];
//                //            });
//                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"暂不支持该支付方式"];
//                [self.commandDelegate sendPluginResult:pluginResult callbackId:cdCommand.callbackId];
//            }
//            else if ([command isEqualToString:@"emallPay"] &&
//                     (   [channelType isEqual:@"0010"]//擎动钱包、快速支付
//                      || [channelType isEqual:@"0018"]//快付通
//                      || [channelType isEqual:@"0042"]//银联全渠道批量代收
//                      || [channelType isEqual:@"0034"]//实时代收
//                      )
//                     )
//            {
//                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"暂不支持该支付方式"];
//                [self.commandDelegate sendPluginResult:pluginResult callbackId:cdCommand.callbackId];
//            }
//            else
//            {//目前此分支，支持0000(付款绑卡)，0001(付款刷卡)，0002(收款刷卡)，0006(银联多渠道实时代付), 0012(刷卡支付)
//                [tempDic setObject:emallAction forKey:@"Emall_Action"];
//                NSArray *arrDTL = [tempDic objectForKey:@"deviceTypeList"];
//                if (![arrDTL respondsToSelector:@selector(count)] || arrDTL.count == 0)
//                {
//                    if ([emallAction isEqualToString:@"4"]||[emallAction isEqualToString:@"5"])
//                    {
//                        [tempDic setObject:@[
//                                             @{@"deviceType" : @"1006"},//Me31
//                                             @{@"deviceType" : @"1008"},//联迪M36
//                                             ]
//                                    forKey:@"deviceTypeList"];
//                    }
//                    else
//                    {
//                        //                        [self showErrorMsg:@"设备列表为空！"];
//                        //                        [[NSNotificationCenter defaultCenter] postNotificationName:@"QDPAY_STATUS_REPORT" object:@"0"];
//                        //                        return NO;
//                    }
//
//
//                    //                    //设置一个默认的deviceTypeList
//                    //                    [tempDic setObject:@[ @{@"deviceType" : @"0002"},//艾创小盒子
//                    //                                          @{@"deviceType" : @"0004"},//BBPOS
//                    //                                          @{@"deviceType" : @"0005"},//ME10
//                    //                                          @{@"deviceType" : @"1002"},//Supay
//                    //                                          @{@"deviceType" : @"1003"},//点付宝
//                    //                                          @{@"deviceType" : @"1004"},//Me30
//                    //                                          @{@"deviceType" : @"1005"},//艾创一体机
//                    //                                          @{@"deviceType" : @"1006"},//Me31
//                    //                                          @{@"deviceType" : @"1007"},//联迪M35
//                    //                                          @{@"deviceType" : @"1008"},//联迪M36
//                    //                                          @{@"deviceType" : @"1010"}]//徽商mPOS
//                    //                                forKey:@"deviceTypeList"];
//                }
//                //                [self performSelector:@selector(readyEmallPay:) withObject:tempDic afterDelay:0.2f];
//                _callbackId = cdCommand.callbackId;
//                [self readyEmallPay:tempDic];
//            }
//        }
    }else{
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"传递参数错误(push)"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:cdCommand.callbackId];
    }
}

//#pragma mark - QDpay
//- (void)readyEmallPay:(NSDictionary *)tempDic
//{
//    self.qdBusiness = [[QDBusiness alloc] init];
//    [[QDDeviceManager sharedInstance] setDelegate:self.qdBusiness];
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(qdonePayReportStatus:) name:@"QDPAY_STATUS_REPORT" object:nil];
//
//    [self orderPay:tempDic];
//}
//- (void)orderPay:(NSDictionary *)tempDic
//{
//    _itemList = [[NSMutableDictionary alloc] initWithDictionary:tempDic];
//    [_itemList setObject:@"0" forKey:@"chargeMoney"];
//    [self checkCardTypeAfterOrderPay];
//}
//- (void)checkCardTypeAfterOrderPay
//{
//    NSString * isUserPayFee = [_itemList objectForKey:@"IS_USER_PAY_FEE"];
//    if (!isUserPayFee) {
//        [self readyPayOrder:_itemList];
//    }
//    else if ([isUserPayFee isEqualToString:@"0"]) {
//        //商户承担手续费
//        [self readyPayOrder:_itemList];
//    }
//    else if ([isUserPayFee isEqualToString:@"1"]) {
//        //用户承担手续费
//
//        NSString * isDebitOrCredit = [_itemList objectForKey:@"DEBIT_OR_CREDIT_CARD"];
//        if (![isDebitOrCredit isEqualToString:@"0"]) {
//            //不区分借贷记卡
//            [_itemList setObject:@"00" forKey:@"cardType"];
//            //            [self readyChargeCheck];
//        }
//        else {
//            //区分借贷记卡
//            //            UIAlertView * alertView = [[UIAlertView alloc] init];
//            //            [alertView addButtonWithTitle:@"借记卡付款"];
//            //            [alertView addButtonWithTitle:@"贷记卡付款"];
//            //            [alertView addButtonWithTitle:@"取消"];
//            //            alertView.tag = TAG_CARD_TYPE;
//            //            alertView.delegate = self;
//            //            [alertView show];
//        }
//    }
//}
//- (void)readyPayOrder:(NSDictionary *)tempDic{
//    QDBaseNavigationController *nav = (QDBaseNavigationController *)[UIApplication sharedApplication].delegate.window.rootViewController;
//    __weak MainViewController *main=  (MainViewController *)nav.visibleViewController;
//
//
//    NSString *markStr = [tempDic valueForKey:@"Emall_Action"];
//    if ([markStr isEqualToString:@"2"])
//    {//打印
//
//        [self.qdBusiness getPrintInfoByOrderID:[tempDic valueForKey:@"PAY_ORDER_ID"]
//                                     isRevoker:[[tempDic valueForKey:@"PAY_OR_DISCARD"] intValue]
//                                     isReprint:YES
//                                        baseVC:main
//                                    otherParam:tempDic];
//    }
//    else if ([markStr isEqualToString:@"4"])
//    {//现金打印
//        //        UIAlertView *alert = [[UIAlertView alloc] init];
//        //        [alert setTitle:@"是否打印小票？"];
//        //        [alert addButtonWithTitle:@"取消"];
//        //        [alert addButtonWithTitle:@"打印"];
//        //        [alert setTag:TAG_CASH_PRINT];
//        //        [alert setDelegate:self];
//        //        [alert show];
//    }
//    else if ([markStr isEqualToString:@"5"])
//    {//现金补打印
//        //        [self cashPay:tempDic];
//    }
//    else if ([markStr isEqualToString:@"3"])
//    {//刷卡取号
//        //        [self performSelectorInBackground:@selector(shuaKaQuHao:) withObject:tempDic];
//    }
//    else if ([markStr isEqualToString:@"1"])
//    {//查询余额
//
//        //----------------------------------------------------
//        //参数检查，如果js没有传，则从本地获得
//        NSDictionary *coInfoDic = [GET_DEFAULT_CO_INFO objectFromJSONString];
//        NSMutableDictionary *newdic = [NSMutableDictionary dictionaryWithDictionary:tempDic];
//        if (![newdic.allKeys containsObject:@"merchantId"])
//        {
//            NSString *merID = coInfoDic[@"merchantId"];
//            if (merID.length <= 0) merID = @"";
//            [newdic setObject:merID forKey:@"merchantId"];
//        }
//        tempDic = newdic;
//        //----------------------------------------------------
//
//
//        NSArray *arrDevices = [tempDic[@"deviceTypeList"] valueForKey:@"deviceType"];
//        //签到时会用到channelType与merchantId（这两个参数是可选项，非必填）
//        NSDictionary *dicOther = [tempDic dictionaryWithValuesForKeys:@[@"channelType",@"merchantId"]];
//        QDDeviceManager *manager = [QDDeviceManager sharedInstance];
//        __weak NSDictionary *mdic = tempDic;
//        [manager getCardData:dicOther supportDevices:arrDevices baseVC:main finished:^(NSError *err, NSDictionary *dic) {
//            if (err)
//            {
//                [main.navigationController popToViewController:main animated:YES];
//                NSLog(@"%@",err);
//                return;
//            }
//
//            [self.qdBusiness balanceWithCardData:dic orderInfo:mdic baseVC:main];
//        }];
//    }
//    else
//    {//消费
//        //----------------------------------------------------
//        //参数检查，如果js没有传，则从本地获得
//        NSDictionary *userInfoDic = [GET_HFK_USER_INFO objectFromJSONString];
//        NSMutableDictionary *newdic = [NSMutableDictionary dictionaryWithDictionary:tempDic];
//        if (![newdic.allKeys containsObject:@"userId"])
//        {
//            NSString *userID = userInfoDic[@"USER_ID"];
//            if (userID.length <= 0) userID = @"";
//            [newdic setObject:userID forKey:@"userId"];
//        }
//        if (![newdic.allKeys containsObject:@"userPhone"])
//        {
//            NSString *phone = userInfoDic[@"PHONE"];
//            if (phone.length <= 0) phone = @"";
//            [newdic setObject:phone forKey:@"userPhone"];
//        }
//        tempDic = newdic;
//        //----------------------------------------------------
//
//        HFKLog(@"订单信息：%@", tempDic);
//
//        NSString *transMoney = tempDic[@"transMoney"];
//        if (transMoney.length <= 0) transMoney = @"";
//        NSArray *arrDevices = [tempDic[@"deviceTypeList"] valueForKey:@"deviceType"];
//        //签到时会用到channelType与merchantId（这两个参数是可选项，非必填）
//        NSMutableDictionary *dicOther = [NSMutableDictionary dictionaryWithDictionary:@{kQDDeviceParamKeyInAmount:transMoney}];
//        [dicOther addEntriesFromDictionary:[tempDic dictionaryWithValuesForKeys:@[@"channelType",@"merchantId"]]];
//        QDDeviceManager *manager = [QDDeviceManager sharedInstance];
//        [manager getCardData:dicOther supportDevices:arrDevices baseVC:main finished:^(NSError *err, NSDictionary *dic) {
//            if (err)
//            {
//                [main.navigationController popToViewController:main animated:YES];
//                NSLog(@"%@",err);
//                [[NSNotificationCenter defaultCenter] postNotificationName:@"QDPAY_STATUS_REPORT" object:@"0"];
//                return;
//            }
//
//            //强制签名流程，先签名再交易
//            NSString *voucherType = tempDic[@"voucherType"];
//            if ([voucherType isEqualToString:@"20"])
//            {//强制签名（先签名再交易）
//                NSString *mallID = tempDic[@"mallId"];//商城ID
//                NSString *thirdOrderID = tempDic[@"thirdOrderNo"];//第三方定单号
//                NSString *amount = tempDic[@"transMoney"];//交易金额
//                NSString *phone = tempDic[@"userPhone"];
//
//                QDHFK_SignHolderVC *tempVC = [[QDHFK_SignHolderVC alloc] init];
//                tempVC.mallIDStr = mallID;
//                tempVC.orderIDStr = thirdOrderID;
//                tempVC.amountStr = amount;
//                tempVC.otherParams = @{@"userPhone":phone};
//                tempVC.signBeforeTradeFinished = ^{
//                    [self.qdBusiness payWithCardData:dic orderInfo:tempDic baseVC:main];
//                };
//
//                [main.navigationController pushViewController:tempVC animated:YES];
//            }
//            else
//            {
//                [self.qdBusiness payWithCardData:dic orderInfo:tempDic baseVC:main];
//            }
//        }];
//    }
//}
//- (void)qdonePayReportStatus:(NSNotification *)noticeObj
//{
//    //原有逻辑中[noticeObj object]的值有如下可能性@"0"，@"1"，@"2"，@"3"
//    //@"0"：通知wap交易失败保持wap当前界面不变
//    //@"1":通知wap交易成功并回到wap的主界面
//    //@"2":通知wap交易结果不确定，银联处理中（也就是原来的10分钟后交易记录查看的提示）
//    //@"3":通知wap交易网络异常
//    //现增加一种可能，当[noticeObj object]为长度大于1的字符串时：
//    //先弹对话框提示该字符串，点确定后发@"1"消息回到主界面
//
//    if ([[noticeObj object] length] > 1)
//    {
//        //        self.cum = [[CustomPickerView alloc] init];
//        //        self.cum.delegate = self;
//        //        [self.cum initWithTitle:@"提 示" message:[noticeObj object] firstBtnTitle:@"确 定" cancelBtnTitle:nil withTag:TAG_ShowErrThenGoMainWeb];
//        return;
//    }
//    else if ([[noticeObj object] isEqualToString:@"b"])
//    {//现增加一种处理情况，当[noticeObj object]为@"b"时，显示主wap，并刷新主wap当前界面，不用回到主wap的主界面
//        //        [self.webView stringByEvaluatingJavaScriptFromString:@"performBack()"];//通知wap返回上个页面
//        //        [self.webView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"onPayResult(%@)", @"1"]];
//    }
//    else
//    {
//        NSString *statusStr = [noticeObj object];
//        //        [self.webView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"onPayResult(%@)", statusStr]];
//        if([statusStr isEqualToString:@"1"]){
//            CDVPluginResult  *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"支付成功"];
//            [self.commandDelegate sendPluginResult:pluginResult callbackId:_callbackId];
//        }else{
//            CDVPluginResult  *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"支付未完成，您可以通过销售订单继续进行支付!"];
//            [self.commandDelegate sendPluginResult:pluginResult callbackId:_callbackId];
//        }
//
//    }
//}

#pragma mark -
@end

