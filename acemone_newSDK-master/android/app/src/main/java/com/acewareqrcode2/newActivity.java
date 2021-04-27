// package com.fingpay.microatmsdk.sample;

// import androidx.appcompat.app.AppCompatActivity;
// import androidx.core.app.ActivityCompat;
// import androidx.core.content.ContextCompat;

// import android.Manifest;
// import android.app.Activity;
// import android.app.AlertDialog;
// import android.content.Context;
// import android.content.DialogInterface;
// import android.content.Intent;
// import android.content.SharedPreferences;
// import android.content.pm.PackageManager;
// import android.os.Bundle;
// import android.provider.Settings;
// import android.telephony.TelephonyManager;
// import android.view.View;
// import android.widget.Button;
// import android.widget.EditText;
// import android.widget.RadioGroup;
// import android.widget.TextView;
// import android.widget.Toast;

// import com.fingpay.microatmsdk.HistoryScreen;
// import com.fingpay.microatmsdk.MicroAtmKeyInjectionScreen;
// import com.fingpay.microatmsdk.MicroAtmLoginScreen;
// import com.fingpay.microatmsdk.data.MiniStatementModel;
// import com.fingpay.microatmsdk.utils.Constants;
// import com.fingpay.microatmsdk.utils.Utils;

// import org.kobjects.util.Util;

// import java.util.ArrayList;
// import java.util.Date;
// import java.util.List;

// public class MainActivity extends Activity {
//     private Context context;

//     private EditText merchIdEt, passwordEt, mobileEt, amountEt, remarksEt;
//     private RadioGroup radioGroup;
//     private Button fingPayBtn, historyBtn;
//     private TextView respTv;

//     private static final int CODE = 1;

//     public static final String SUPER_MERCHANT_ID = "2";

//     private static final int PERMISSION_CALLBACK_CONSTANT = 100;
//     private static final int REQUEST_PERMISSION_SETTING = 101;
//     String[] permissionsRequired = new String[]{
//             android.Manifest.permission.READ_PHONE_STATE
//     };
//     private SharedPreferences permissionStatus;

//     @Override
//     protected void onCreate(Bundle savedInstanceState) {
//         super.onCreate(savedInstanceState);
//         setContentView(R.layout.activity_main);

//         permissionStatus = getSharedPreferences("microatm_sample", 0);

//         context = MainActivity.this;

//         merchIdEt = findViewById(R.id.et_merch_id);
//         passwordEt = findViewById(R.id.et_merch_pin);
//         mobileEt = findViewById(R.id.et_mobile);
//         amountEt = findViewById(R.id.et_amount);
//         remarksEt = findViewById(R.id.et_remarks);

//         radioGroup = findViewById(R.id.rg_type);

//         fingPayBtn = findViewById(R.id.btn_fingpay);
//         fingPayBtn.setOnClickListener(listener);

//         historyBtn = findViewById(R.id.btn_history);
//         historyBtn.setOnClickListener(listener);


//         respTv = findViewById(R.id.tv_transaction);

//         checkPermissions();

//     }

//     private View.OnClickListener listener = new View.OnClickListener() {
//         @Override
//         public void onClick(View view) {
//            String imei = getImei();
//            // String imei = "1234";
//             switch (view.getId()) {
//                 case R.id.btn_fingpay:
//                     String merchantId = merchIdEt.getText().toString().trim();
//                     String password = passwordEt.getText().toString().trim();
//                     String mobile = mobileEt.getText().toString().trim();
//                     String amount = amountEt.getText().toString().trim();
//                     String remarks = remarksEt.getText().toString().trim();

//                     if (isValidString(merchantId)) {
//                         if (isValidString(password)) {
//                             Utils.dissmissKeyboard(merchIdEt);
//                             Intent intent = new Intent(MainActivity.this, MicroAtmLoginScreen.class);
//                             intent.putExtra(Constants.MERCHANT_USERID, merchantId);
//                             // this MERCHANT_USERID be given by FingPay depending on the merchant, only that value need to sent from App to SDK

//                             intent.putExtra(Constants.MERCHANT_PASSWORD, password);
//                             // this MERCHANT_PASSWORD be given by FingPay depending on the merchant, only that value need to sent from App to SDK

//                             intent.putExtra(Constants.AMOUNT, amount);
//                             intent.putExtra(Constants.REMARKS, remarks);


//                             intent.putExtra(Constants.MOBILE_NUMBER, mobile);
//                             // send a valid 10 digit mobile number from the app to SDK

//                             intent.putExtra(Constants.AMOUNT_EDITABLE, false);
//                             // send true if Amount can be edited in the SDK or send false then Amount cant be edited in the SDK

// //                            double val = Math.random();
// //                            String txn = "Fp" + val;
// //                            txn = txn.replaceAll(".", "");
// //                            txn = txn.substring(0,20);

// //                            Log.d("Test", "Tx :" +txn);
// //                            intent.putExtra(Constants.TXN_ID, txn);
//                             String s = "fingpay" + String.valueOf(new Date().getTime());
//                             intent.putExtra(Constants.TXN_ID, s);
//                             Utils.logD(s);
//                             // some dummy value is given in TXN_ID for now but some proper value should come from App to SDK

//                             intent.putExtra(Constants.SUPER_MERCHANTID, SUPER_MERCHANT_ID);
//                             // this SUPER_MERCHANT_ID be given by FingPay to you, only that value need to sent from App to SDK

//                             intent.putExtra(Constants.IMEI, imei);

//                             double lat = 17.4442015, lng = 78.4808421;  // get current location and send these values
//                             intent.putExtra(Constants.LATITUDE, lat);
//                             intent.putExtra(Constants.LONGITUDE, lng);

//                             int id = radioGroup.getCheckedRadioButtonId();
//                             switch (id) {
//                                 case R.id.rb_cw:
//                                     intent.putExtra(Constants.TYPE, Constants.CASH_WITHDRAWAL);
//                                     break;

//                                 case R.id.rb_cd:
//                                     intent.putExtra(Constants.TYPE, Constants.CASH_DEPOSIT);
//                                     break;

//                                 case R.id.rb_be:
//                                     intent.putExtra(Constants.TYPE, Constants.BALANCE_ENQUIRY);
//                                     break;

//                                 case R.id.rb_ms:
//                                     intent.putExtra(Constants.TYPE, Constants.MINI_STATEMENT);
//                                     break;

//                                 case R.id.rb_rp:
//                                     intent.putExtra(Constants.TYPE, Constants.PIN_RESET);
//                                     break;

//                                 case R.id.rb_cp:
//                                     intent.putExtra(Constants.TYPE, Constants.CHANGE_PIN);
//                                     break;

//                                 case R.id.rb_ca:
//                                     intent.putExtra(Constants.TYPE, Constants.CARD_ACTIVATION);
//                                     break;
//                             }

//                             intent.putExtra(Constants.MICROATM_MANUFACTURER, Constants.MoreFun);

//                             startActivityForResult(intent, CODE);
//                         } else {
//                             Toast.makeText(context, "Please enter the password", Toast.LENGTH_SHORT).show();
//                         }
//                     } else {
//                         Toast.makeText(context, "Please enter the merchant id", Toast.LENGTH_SHORT).show();
//                     }
//                     break;


//                 case R.id.btn_history:
//                     String mId = merchIdEt.getText().toString().trim();
//                     String pswd = passwordEt.getText().toString().trim();
//                     Utils.dissmissKeyboard(merchIdEt);
//                     Intent intent = new Intent(MainActivity.this, HistoryScreen.class);
//                     intent.putExtra(Constants.MERCHANT_USERID, mId);
//                     // this MERCHANT_USERID be given by FingPay depending on the merchant, only that value need to sent from App to SDK

//                     intent.putExtra(Constants.MERCHANT_PASSWORD, pswd);
//                     // this MERCHANT_PASSWORD be given by FingPay depending on the merchant, only that value need to sent from App to SDK

//                     intent.putExtra(Constants.SUPER_MERCHANTID, SUPER_MERCHANT_ID);
//                     // this SUPER_MERCHANT_ID be given by FingPay to you, only that value need to sent from App to SDK

//                     intent.putExtra(Constants.IMEI, imei);

//                     startActivity(intent);

//                     break;


//                 default:
//                     break;
//             }
//         }
//     };

//     public static boolean isValidString(String str) {
//         if (str != null) {
//             str = str.trim();
//             if (str.length() > 0)
//                 return true;
//         }
//         return false;
//     }

//     @Override
//     protected void onActivityResult(int requestCode, int resultCode, Intent data) {
//         if (resultCode == RESULT_OK && requestCode == CODE) {
//             Toast.makeText(context, "res" + data.getExtras().toString(), Toast.LENGTH_SHORT).show();
//             Utils.logD(data.getExtras().toString());
//             boolean status = data.getBooleanExtra(Constants.TRANS_STATUS, false);
//             String response = data.getStringExtra(Constants.MESSAGE);
//             double transAmount = data.getDoubleExtra(Constants.TRANS_AMOUNT, 0);
//             double balAmount = data.getDoubleExtra(Constants.BALANCE_AMOUNT, 0);
//             String bankRrn = data.getStringExtra(Constants.RRN);
//             String transType = data.getStringExtra(Constants.TRANS_TYPE);
//             int type = data.getIntExtra(Constants.TYPE, Constants.CASH_WITHDRAWAL);
//             String cardNum =data.getStringExtra(Constants.CARD_NUM);
//             String bankName = data.getStringExtra(Constants.BANK_NAME);
//             String cardType = data.getStringExtra(Constants.CARD_TYPE);
//             String terminalId = data.getStringExtra(Constants.TERMINAL_ID);

//             if (type == Constants.MINI_STATEMENT) {
//                 List<MiniStatementModel> l = data.getParcelableArrayListExtra(Constants.LIST);
//                 if (Utils.isValidArrayList((ArrayList<?>) l)) {
//                     Utils.logD(l.toString());
//                 }
//             }

//             if (isValidString(response)) {
//                 if (!Utils.isValidString(bankRrn))
//                     bankRrn = "";
//                 if (!Utils.isValidString(transType))
//                     transType = "";

//                 String s = "Status :" + status + "\n" + "Message : " + response + "\n"
//                         + "Trans Amount : " + transAmount + "\n" + "Balance Amount : " + balAmount + "\n"
//                         + "Bank RRN : " + bankRrn + "\n" + "Trand Type : " + transType + "\n"
//                         + "Type : " + type + "\n" + "Card Num :" + cardNum + "\n" + "CardType :" + cardType + "\n" + "Bank Name :" + bankName + "\n" + "Terminal Id :" + terminalId;


//                 Utils.logD("micro atm result s:" + s);
//                 respTv.setText(s);
//                 respTv.setVisibility(View.VISIBLE);

//             }
//         } else if (requestCode == REQUEST_PERMISSION_SETTING) {
//             if (ActivityCompat.checkSelfPermission(MainActivity.this, permissionsRequired[0]) == PackageManager.PERMISSION_GRANTED) {
//             }
//         } else if (resultCode == RESULT_CANCELED) {
//             Toast.makeText(context, "cancelled", Toast.LENGTH_SHORT).show();
//             respTv.setText("");
//         }
//     }

//     public String getImei() {
//         String imei = "";
//         try {
//             TelephonyManager telephonyManager = (TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);
//             if (ActivityCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
//                 return "";
//             }
//             imei = telephonyManager.getDeviceId();

//         } catch (Exception e) {
//             Utils.logE(e.toString());
//             if (!Utils.isValidString(imei))
//                 imei = Settings.Secure.getString(context.getContentResolver(),
//                         Settings.Secure.ANDROID_ID);
//             Utils.logD("IMEI: " + imei);

//         }
//         return imei;
//     }


//     private List<String> getUngrantedPermissions() {
//         List<String> permissions = new ArrayList<>();

//         for (String s : permissionsRequired) {
//             if (ContextCompat.checkSelfPermission(context, s) != PackageManager.PERMISSION_GRANTED)
//                 permissions.add(s);
//         }

//         return permissions;
//     }

//     private void checkPermissions() {
//         List<String> permissions = getUngrantedPermissions();
//         if (!permissions.isEmpty()) {
//             ActivityCompat.requestPermissions(MainActivity.this,
//                     permissions.toArray(new String[permissions.size()]),
//                     PERMISSION_CALLBACK_CONSTANT);

//             SharedPreferences.Editor editor = permissionStatus.edit();
//             editor.putBoolean(permissionsRequired[0], true);
//             editor.commit();
//         } else {
//         }
//     }

//     @Override
//     public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
//         super.onRequestPermissionsResult(requestCode, permissions, grantResults);
//         if (requestCode == PERMISSION_CALLBACK_CONSTANT) {
//             boolean allgranted = false;
//             for (int i = 0; i < grantResults.length; i++) {
//                 if (grantResults[i] == PackageManager.PERMISSION_GRANTED) {
//                     allgranted = true;
//                 } else {
//                     allgranted = false;
//                     break;
//                 }
//             }

//             if (allgranted) {

//             } else if (Utils.isValidArrayList((ArrayList<?>) getUngrantedPermissions())) {
//                 AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
//                 builder.setTitle(getString(R.string.need_permissions));
//                 builder.setMessage(getString(R.string.device_permission));
//                 builder.setPositiveButton(getString(R.string.grant), new DialogInterface.OnClickListener() {
//                     @Override
//                     public void onClick(DialogInterface dialog, int which) {
//                         dialog.cancel();
//                         ActivityCompat.requestPermissions(MainActivity.this, permissionsRequired, PERMISSION_CALLBACK_CONSTANT);
//                     }
//                 });
//                 builder.setNegativeButton(getString(R.string.cancel_btn), new DialogInterface.OnClickListener() {
//                     @Override
//                     public void onClick(DialogInterface dialog, int which) {
//                         dialog.cancel();
//                     }
//                 });
//                 builder.show();
//             } else {
//                 Toast.makeText(getBaseContext(), getString(R.string.unable_toget_permission), Toast.LENGTH_LONG).show();
//             }
//         }
//     }

// }
