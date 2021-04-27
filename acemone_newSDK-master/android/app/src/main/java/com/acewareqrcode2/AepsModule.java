package com.acewareqrcode2;

import android.widget.Toast;
import android.content.Intent;
import android.net.Uri;
import android.app.Activity;
import android.util.SparseArray;
import android.content.pm.PackageManager;
import android.content.ComponentName;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.modules.core.PermissionListener;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.fingpay.microatmsdk.HistoryScreen;
//import com.fingpay.microatmsdk.MicroAtmKeyInjectionScreen;
import com.fingpay.microatmsdk.MicroAtmLoginScreen;
import com.fingpay.microatmsdk.data.MiniStatementModel;
import com.fingpay.microatmsdk.utils.Constants;
import com.fingpay.microatmsdk.utils.Utils;

import org.kobjects.util.Util;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;



import java.util.Map;
import java.util.HashMap;

public class AepsModule extends ReactContextBaseJavaModule implements ActivityEventListener,PermissionListener {
  private static ReactApplicationContext reactContext;

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";
  private static final int CODE = 1;
  private Context context;
  public static final String SUPER_MERCHANT_ID = "920";

  private static final int PERMISSION_CALLBACK_CONSTANT = 100;
  private static final int REQUEST_PERMISSION_SETTING = 101;
  String[] permissionsRequired = new String[]{
         // android.Manifest.permission.READ_PHONE_STATE
  };
  private SharedPreferences permissionStatus;

  private final SparseArray<Promise> mPromises;

  AepsModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
    mPromises = new SparseArray<>();
    
  }

   @Override
  public String getName() {
    return "Mahagram";
  }

    @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }

@Override
public void initialize() {
  super.initialize();
  getReactApplicationContext().addActivityEventListener(this);
  permissionStatus = getReactApplicationContext().getCurrentActivity().getSharedPreferences("microatm_sample", 0);

context = getReactApplicationContext();
checkPermissions();
}

@Override
public void onCatalystInstanceDestroy() {
  super.onCatalystInstanceDestroy();
  getReactApplicationContext().removeActivityEventListener(this);
}

@Override
        public void onNewIntent(Intent intent) {
           // sendJSEvent(intent);
        }


public static boolean isPackageInstalled(String packagename,PackageManager packageManager)
 {
   try {
    packageManager.getPackageInfo(packagename, 0);
    return true;
   } 
   catch (PackageManager.NameNotFoundException e) {
      return false;
   }
 }

 public static boolean isValidString(String str) {
  if (str != null) {
      str = str.trim();
      if (str.length() > 0)
          return true;
  }
  return false;
}

private void onConnected(String requesttxn,String bankremarks,String refstan,String cardno,String date,String amount,String invoicenumber,String mid,String tid,String clientrefid,String vendorid,String udf1,String udf2,String udf3,String udf4,String txnamount,String rrn,String respcode) {
  // Create map for params
  WritableMap payload = Arguments.createMap();
  // Put data to map


  payload.putString("requesttxn",requesttxn);
  payload.putString("bankremarks",bankremarks);
  payload.putString("refstan",refstan);
  payload.putString("cardno",cardno );
  payload.putString("date",date );
  payload.putString("amount",amount );
  payload.putString("invoicenumber",invoicenumber );
  payload.putString("mid",mid );
  payload.putString("tid",tid );
  payload.putString("vendorid",vendorid );
  payload.putString("udf1",udf1 );
  payload.putString("udf2",udf2 );
  payload.putString("udf3",udf3 );
  payload.putString("udf4",udf4 );
  
  payload.putString("txnamount",txnamount );
  payload.putString("rrn",rrn );
    payload.putString("respcode",respcode );
  // Get EventEmitter from context and send event thanks to it
  this.reactContext
    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
    .emit("onSessionConnect", payload);
}

private void onSendData(boolean status,String response,double transAmount,double balAmount,String bankRrn,String transType,int type,String cardNum,String bankName,String cardType,String terminalId) {
  // Create map for params
  WritableMap payload = Arguments.createMap();
  // Put data to map



  

  payload.putString("status",String.valueOf(status));
  payload.putString("response",response);
  payload.putString("transAmount",String.valueOf(transAmount));
  payload.putString("balAmount",String.valueOf(balAmount ));
  payload.putString("bankRrn",bankRrn );
  payload.putString("transType",transType );
  payload.putString("type",String.valueOf(type ));
  payload.putString("cardNum",cardNum );
  payload.putString("bankName",bankName );
  payload.putString("cardType",cardType );
  payload.putString("terminalId",terminalId );
  
  
 
  // Get EventEmitter from context and send event thanks to it
  this.reactContext
    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
    .emit("onSessionConnect", payload);
}

@ReactMethod
  public void show_mahagram(String saltkey,String secretkey,String bcid,String userid,String bcemailid,String phone1,String clientredid ,Promise promise) {
    
    try {
       Activity activity = getReactApplicationContext().getCurrentActivity();
       PackageManager packageManager = activity.getPackageManager();
if (!isPackageInstalled("org.egram.microatm", packageManager)) { 

       Toast.makeText(getReactApplicationContext(), "Please install the Application from Playstore", 2000).show();
      activity.startActivityForResult(new Intent(Intent.ACTION_VIEW,Uri.parse("https://play.google.com/store/apps/details?id=org.egram.microatm")),2);
      mPromises.put(2, promise);
}else{
 
Intent intent = new Intent();
intent.setComponent(new ComponentName("org.egram.microatm","org.egram.microatm.BluetoothMacSearchActivity"));
intent.putExtra("saltkey", saltkey);
intent.putExtra("secretkey", secretkey);
intent.putExtra("bcid", bcid);
 intent.putExtra("userid", userid); 
 intent.putExtra("bcemailid", bcemailid); 
 intent.putExtra("phone1", phone1); 
 intent.putExtra("clientrefid", clientredid); 
 intent.putExtra("vendorid", "");
intent.putExtra("udf1", ""); 
intent.putExtra("udf2", "");
 intent.putExtra("udf3", ""); 
 intent.putExtra("udf4", ""); 
 activity.startActivityForResult(intent, 1);
 mPromises.put(1, promise);
 
 
}
      
} 
catch (Exception e) {
  Toast.makeText(getReactApplicationContext(), "error",2000).show();
  
e.printStackTrace();
}
  }

 @ReactMethod
  public void Toast(String message)
  {
    Toast.makeText(getReactApplicationContext(), message, 2000).show();
  }

  @ReactMethod
  public void show(Double latitude,Double longitude,String merchantid_passed,String password_passed,String mobile_passed,String amount_passed,String remarks_passed,Integer mainChoice ,Integer transactionOption,Promise promise) {
    if (ActivityCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED || ActivityCompat.checkSelfPermission(context, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED  || ActivityCompat.checkSelfPermission(context, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
      ActivityCompat.requestPermissions(getReactApplicationContext().getCurrentActivity(), new String[]{Manifest.permission.READ_PHONE_STATE,Manifest.permission.READ_EXTERNAL_STORAGE,Manifest.permission.WRITE_EXTERNAL_STORAGE}, 2);
      Toast.makeText(getReactApplicationContext(),"Reselect 'Connect to Micro - Atm Device' option after providing all permissions", 2000).show();
    }else{
      try {
        Activity activity = getReactApplicationContext().getCurrentActivity();
        
        String imei = getImei();
        // String imei = "1234";
         switch (mainChoice) {
             case 1:
                 // String merchantId = merchIdEt.getText().toString().trim();
                 // String password = passwordEt.getText().toString().trim();
                 // String mobile = mobileEt.getText().toString().trim();
                 // String amount = amountEt.getText().toString().trim();
                 // String remarks = remarksEt.getText().toString().trim();
                
                 String merchantId = merchantid_passed;
                 String password = password_passed;
                 String mobile = mobile_passed;
                 String amount = amount_passed;
                 String remarks = remarks_passed;


                //  String merchantId = "acewarem";
                //  String password = "1234m";
                //  String mobile = "9999999999";
                //  String amount = "100";
                //  String remarks = "none";
 
                 if (isValidString(merchantId)) {
                     if (isValidString(password)) {
                        // Utils.dissmissKeyboard(merchIdEt);
                         Intent intent = new Intent(getReactApplicationContext(), MicroAtmLoginScreen.class);
                         intent.putExtra(Constants.MERCHANT_USERID, merchantId);
                         // this MERCHANT_USERID be given by FingPay depending on the merchant, only that value need to sent from App to SDK
 
                         intent.putExtra(Constants.MERCHANT_PASSWORD, password);
                         // this MERCHANT_PASSWORD be given by FingPay depending on the merchant, only that value need to sent from App to SDK
 
                         intent.putExtra(Constants.AMOUNT, amount);
                         intent.putExtra(Constants.REMARKS, remarks);
 
 
                         intent.putExtra(Constants.MOBILE_NUMBER, mobile);
                         // send a valid 10 digit mobile number from the app to SDK
 
                         intent.putExtra(Constants.AMOUNT_EDITABLE, false);
                         // send true if Amount can be edited in the SDK or send false then Amount cant be edited in the SDK
 
 //                            double val = Math.random();
 //                            String txn = "Fp" + val;
 //                            txn = txn.replaceAll(".", "");
 //                            txn = txn.substring(0,20);
 
 //                            Log.d("Test", "Tx :" +txn);
 //                            intent.putExtra(Constants.TXN_ID, txn);
                         String s = "aceware" + String.valueOf(new Date().getTime());
                         intent.putExtra(Constants.TXN_ID, s);
                         //Utils.logD(s);
                         // some dummy value is given in TXN_ID for now but some proper value should come from App to SDK
 
                         intent.putExtra(Constants.SUPER_MERCHANTID, SUPER_MERCHANT_ID);
                         // this SUPER_MERCHANT_ID be given by FingPay to you, only that value need to sent from App to SDK
 
                         intent.putExtra(Constants.IMEI, imei);
 
                        // double lat = 17.4442015, lng = 78.4808421;  // get current location and send these values
                        double lat = latitude, lng =longitude; 
                         intent.putExtra(Constants.LATITUDE, lat);
                         intent.putExtra(Constants.LONGITUDE, lng);
 
                         
                         switch (transactionOption) {
                             case 1:
                                 intent.putExtra(Constants.TYPE, Constants.CASH_WITHDRAWAL);
                                 break;
 
                             case 2:
                                 intent.putExtra(Constants.TYPE, Constants.CASH_DEPOSIT);
                                 break;
 
                             case 3:
                                 intent.putExtra(Constants.TYPE, Constants.BALANCE_ENQUIRY);
                                 break;
 
                             case 4:
                                 intent.putExtra(Constants.TYPE, Constants.MINI_STATEMENT);
                                 break;
 
                             case 5:
                                 intent.putExtra(Constants.TYPE, Constants.PIN_RESET);
                                 break;
 
                             case 6:
                                 intent.putExtra(Constants.TYPE, Constants.CHANGE_PIN);
                                 break;
 
                             case 7:
                                 intent.putExtra(Constants.TYPE, Constants.CARD_ACTIVATION);
                                 break;
                         }
 
                         intent.putExtra(Constants.MICROATM_MANUFACTURER, Constants.MoreFun);
 
                         //startActivityForResult(intent, CODE);
                         activity.startActivityForResult(intent, 2);
                         mPromises.put(2, promise);
                     } else {
                         Toast.makeText(context, "Please enter the password", Toast.LENGTH_SHORT).show();
                     }
                 } else {
                     Toast.makeText(context, "Please enter the merchant id", Toast.LENGTH_SHORT).show();
                 }
                 break;
 
 
             case 2:
                 // String mId = merchIdEt.getText().toString().trim();
                 // String pswd = passwordEt.getText().toString().trim();
                   String mId = merchantid_passed;
                 String pswd =password_passed;
                 //Utils.dissmissKeyboard(merchIdEt);
                 Intent intent = new Intent(getReactApplicationContext(), HistoryScreen.class);
                 intent.putExtra(Constants.MERCHANT_USERID, mId);
                 // this MERCHANT_USERID be given by FingPay depending on the merchant, only that value need to sent from App to SDK
 
                 intent.putExtra(Constants.MERCHANT_PASSWORD, pswd);
                 // this MERCHANT_PASSWORD be given by FingPay depending on the merchant, only that value need to sent from App to SDK
 
                 intent.putExtra(Constants.SUPER_MERCHANTID, SUPER_MERCHANT_ID);
                 // this SUPER_MERCHANT_ID be given by FingPay to you, only that value need to sent from App to SDK
 
                 intent.putExtra(Constants.IMEI, imei);
 
                 //startActivity(intent);
                 activity.startActivityForResult(intent, 2);
                 mPromises.put(2, promise);
 
                 break;
 
 
             default:
                 break;
         }
        } 
        catch (Exception e) {
          Toast.makeText(getReactApplicationContext(), "error",2000).show();
          
        e.printStackTrace();
        }
 
     }

    












//        PackageManager packageManager = activity.getPackageManager();
// if (!isPackageInstalled("org.egram.microatm", packageManager)) { 

//        Toast.makeText(getReactApplicationContext(), "Please install the Application from Playstore", 2000).show();
//       activity.startActivityForResult(new Intent(Intent.ACTION_VIEW,Uri.parse("https://play.google.com/store/apps/details?id=org.egram.microatm")),2);
//       mPromises.put(2, promise);
// }else{
 
// Intent intent = new Intent();
// intent.setComponent(new ComponentName("org.egram.microatm","org.egram.microatm.BluetoothMacSearchActivity"));
// intent.putExtra("saltkey", saltkey);
// intent.putExtra("secretkey", secretkey);
// intent.putExtra("bcid", bcid);
//  intent.putExtra("userid", userid); 
//  intent.putExtra("bcemailid", bcemailid); 
//  intent.putExtra("phone1", phone1); 
//  intent.putExtra("clientrefid", clientredid); 
//  intent.putExtra("vendorid", "");
// intent.putExtra("udf1", ""); 
// intent.putExtra("udf2", "");
//  intent.putExtra("udf3", ""); 
//  intent.putExtra("udf4", ""); 
//  activity.startActivityForResult(intent, 1);
//  mPromises.put(1, promise);
 
 
// }







      

  }



@Override
public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {




  if (resultCode == activity.RESULT_OK && requestCode == 2) {
    //Toast.makeText(context, "res" + data.getExtras().toString(), Toast.LENGTH_SHORT).show();
    //Utils.logD(data.getExtras().toString());
    boolean status = data.getBooleanExtra(Constants.TRANS_STATUS, false);
    String response = data.getStringExtra(Constants.MESSAGE);
    double transAmount = data.getDoubleExtra(Constants.TRANS_AMOUNT, 0);
    double balAmount = data.getDoubleExtra(Constants.BALANCE_AMOUNT, 0);
    String bankRrn = data.getStringExtra(Constants.RRN);
    String transType = data.getStringExtra(Constants.TRANS_TYPE);
    int type = data.getIntExtra(Constants.TYPE, Constants.CASH_WITHDRAWAL);
    String cardNum =data.getStringExtra(Constants.CARD_NUM);
    String bankName = data.getStringExtra(Constants.BANK_NAME);
    String cardType = data.getStringExtra(Constants.CARD_TYPE);
    String terminalId = data.getStringExtra(Constants.TERMINAL_ID);

    if (type == Constants.MINI_STATEMENT) {
        List<MiniStatementModel> l = data.getParcelableArrayListExtra(Constants.LIST);
        // if (Utils.isValidArrayList((ArrayList<?>) l)) {
        //   //  Utils.logD(l.toString());
        // }
    }

    if (isValidString(response)) {
        if (isValidString(bankRrn)==false)
            bankRrn = "";
        if (isValidString(transType)==false)
            transType = "";

        String s = "Status :" + status + "\n" + "Message : " + response + "\n"
                + "Trans Amount : " + transAmount + "\n" + "Balance Amount : " + balAmount + "\n"
                + "Bank RRN : " + bankRrn + "\n" + "Trand Type : " + transType + "\n"
                + "Type : " + type + "\n" + "Card Num :" + cardNum + "\n" + "CardType :" + cardType + "\n" + "Bank Name :" + bankName + "\n" + "Terminal Id :" + terminalId;


     //   Utils.logD("micro atm result s:" + s);
        // respTv.setText(s);
        // respTv.setVisibility(View.VISIBLE);
        onSendData(status,response,transAmount,balAmount,bankRrn,transType,type,cardNum,bankName,cardType,terminalId);
    }
}else if(requestCode == 1)
{
  Promise promise = mPromises.get(requestCode);
  if (promise != null) {
    
    if (requestCode == 1) {
if (resultCode == activity.RESULT_OK) {
  String respCode=data.getStringExtra("respcode");
if(respCode.equals("999")){
  String requesttxn = data.getStringExtra("requesttxn ");//Type of transaction
String refstan = data.getStringExtra("refstan");// Mahagram Stan Numbe
String txnamount = data.getStringExtra("txnamount");//Transaction amount (0 in case of balance inquiry and transaction amount in cash withdrawal)
String mid = data.getStringExtra("mid");//Mid
String tid = data.getStringExtra("tid");//Tid
String clientrefid = data.getStringExtra("clientrefid");//Your reference Id
 String vendorid = data.getStringExtra("vendorid");//Your define value 
 String udf1 = data.getStringExtra("udf1");//Your define value
String udf2 = data.getStringExtra("udf2");//Your define value 
String udf3 = data.getStringExtra("udf3");//Your define value 
String udf4 = data.getStringExtra("udf4");//Your define value
 String date = data.getStringExtra("date");//Date of transaction
onConnected(requesttxn,"Pending",refstan,"",date,"0","",mid,tid,clientrefid,vendorid,udf1,udf2,udf3,udf4,txnamount,"","");

}else{
  String requesttxn = data.getStringExtra("requesttxn ");//Type of transaction
String bankremarks = data.getStringExtra("msg");//Bank message
String refstan = data.getStringExtra("refstan");// Mahagram Stan Number
String cardno = data.getStringExtra("cardno");//Atm card number
 String date = data.getStringExtra("date");//Date of transaction 
 String amount = data.getStringExtra("amount");//Account Balance
String invoicenumber = data.getStringExtra("invoicenumber");//Invoice Number
String mid = data.getStringExtra("mid");//Mid
String tid = data.getStringExtra("tid");//Tid
String clientrefid = data.getStringExtra("clientrefid");//Your reference Id 
String vendorid = data.getStringExtra("vendorid");//Your define value 
String udf1 = data.getStringExtra("udf1");//Your define value
String udf2 = data.getStringExtra("udf2");//Your define value
String udf3 = data.getStringExtra("udf3");//Your define value
String udf4 = data.getStringExtra("udf4");//Your define value
String txnamount = data.getStringExtra("txnamount");//Transaction amount (0 in case of balance inquiry and transaction amount in cash withdrawal)
String rrn = data.getStringExtra("rrn");//Bank RRN number
 onConnected(requesttxn,bankremarks,refstan,cardno,date,amount,invoicenumber,mid,tid,clientrefid,vendorid,udf1,udf2,udf3,udf4,txnamount,rrn,"");
 //onConnected(requesttxn,bankremarks,refstan,cardno,date,amount,invoicenumber,mid,tid,clientrefid,vendorid,udf1,udf2,udf3,udf4,txnamount,rrn,respcode);
}
}
 else {

data.getStringExtra("statuscode");    //to get status code 
data.getStringExtra("message");     //to get response message 

if(data.getStringExtra("statuscode").equals("111"))
{
  Toast.makeText(getReactApplicationContext(), "Please update the Application from Playstore", 2000).show();
      activity.startActivityForResult(new Intent(Intent.ACTION_VIEW,Uri.parse("https://play.google.com/store/apps/details?id=org.egram.microatm")),2);
      mPromises.put(2, promise);
}
else{
  Toast.makeText(getReactApplicationContext(), data.getStringExtra("message"),2000).show();
}


}





    }
   promise.resolve("ok");
  }
}

else if (requestCode == REQUEST_PERMISSION_SETTING) {
    if (ActivityCompat.checkSelfPermission(getReactApplicationContext().getCurrentActivity(), permissionsRequired[0]) == PackageManager.PERMISSION_GRANTED) {
    }
} else if (resultCode == activity.RESULT_CANCELED) {
    //Toast.makeText(getReactApplicationContext(), "cancelled", Toast.LENGTH_SHORT).show();
   // respTv.setText("");
}


  
  
}


public String getImei() {
  
  String imei = "";
  try {
      TelephonyManager telephonyManager = (TelephonyManager) getReactApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
      if (ActivityCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
        ActivityCompat.requestPermissions(getReactApplicationContext().getCurrentActivity(), new String[]{Manifest.permission.READ_PHONE_STATE}, 2);
          return "";
      }
      imei = telephonyManager.getDeviceId();

  } catch (Exception e) {
     // Utils.logE(e.toString());
      if (isValidString(imei)==false)
          imei = Settings.Secure.getString(context.getContentResolver(),
                  Settings.Secure.ANDROID_ID);
     // Utils.logD("IMEI: " + imei);

  }
  return imei;
}


private List<String> getUngrantedPermissions() {
  List<String> permissions = new ArrayList<>();
 
  for (String s : permissionsRequired) {
      if (ContextCompat.checkSelfPermission(context, s) != PackageManager.PERMISSION_GRANTED)
          permissions.add(s);
  }

  return permissions;
}

private void checkPermissions() {
  List<String> permissions = getUngrantedPermissions();
  if (!permissions.isEmpty()) {
      ActivityCompat.requestPermissions(getReactApplicationContext().getCurrentActivity(),
              permissions.toArray(new String[permissions.size()]),
              PERMISSION_CALLBACK_CONSTANT);

      SharedPreferences.Editor editor = permissionStatus.edit();
     // editor.putBoolean(permissionsRequired[0], true);
      editor.commit();
  } else {
  }
}

//@Override
public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
 // super.onRequestPermissionsResult(requestCode, permissions, grantResults);
  if (requestCode == PERMISSION_CALLBACK_CONSTANT) {
      boolean allgranted = false;
      for (int i = 0; i < grantResults.length; i++) {
          if (grantResults[i] == PackageManager.PERMISSION_GRANTED) {
              allgranted = true;
          } else {
              allgranted = false;
              break;
          }
      }

      if (allgranted) {

      } //else if (Utils.isValidArrayList((ArrayList<?>) getUngrantedPermissions())) {
        else{
          AlertDialog.Builder builder = new AlertDialog.Builder(getReactApplicationContext());
          builder.setTitle("Permission");
          builder.setMessage("Provide permission");
          builder.setPositiveButton("Grant", new DialogInterface.OnClickListener() {
              @Override
              public void onClick(DialogInterface dialog, int which) {
                  dialog.cancel();
                  ActivityCompat.requestPermissions(getReactApplicationContext().getCurrentActivity(), permissionsRequired, PERMISSION_CALLBACK_CONSTANT);
              }
          });
          builder.setNegativeButton("cancel", new DialogInterface.OnClickListener() {
              @Override
              public void onClick(DialogInterface dialog, int which) {
                  dialog.cancel();
              }
          });
          builder.show();
      }
      //  else {
      //     Toast.makeText(getReactApplicationContext(), "Unable to toggle Permission", Toast.LENGTH_LONG).show();
      // }
  }
  return true;
}


// @Override
// protected void onActivityResult(int requestCode, int resultCode, Intent data) {
// super.onActivityResult(requestCode, resultCode, data);

// if (requestCode == 1) {
// if (resultCode == RESULT_OK) {
// String requesttxn = data.getStringExtra("requesttxn ");//Type of transaction
// String bankremarks = data.getStringExtra("msg");//Bank message
// String refstan = data.getStringExtra("refstan");// Mahagram Stan Number
// String cardno = data.getStringExtra("cardno");//Atm card number String date = data.getStringExtra("date");//Date of transaction String amount = data.getStringExtra("amount");//Account Balance
// String invoicenumber = data.getStringExtra("invoicenumber");//Invoice Number
// String mid = data.getStringExtra("mid");//Mid
// String tid = data.getStringExtra("tid");//Tid
// String clientrefid = data.getStringExtra("clientrefid");//Your reference Id String vendorid = data.getStringExtra("vendorid");//Your define value String udf1 = data.getStringExtra("udf1");//Your define value
// String udf2 = data.getStringExtra("udf2");//Your define value String udf3 = data.getStringExtra("udf3");//Your define value String udf4 = data.getStringExtra("udf4");//Your define value
// String txnamount = data.getStringExtra("txnamount");//Transaction amount (0 in case of balance inquiry and transaction amount in cash withdrawal)
// String rrn = data.getStringExtra("rrn");//Bank RRN number
// String respcode = data.getStringExtra("respcode  " ) ;//Response  c ode  of  ba nk(  “ 00”  for  succ ess  tra nsa c tion) 
// } else {
// data.getStringExtra("statuscode"); //to get status code
// data.getStringExtra("message");     //to get response message

// }
// }
// }




 @ReactMethod
  public void callBack(int i,Callback errorCallback,
      Callback successCallback)
      {
       
        if(i==0)
        {
          successCallback.invoke("sucess");
        }
        else{
          errorCallback.invoke("error");
        }

      }

}