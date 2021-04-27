import axios from 'axios';
import {AsyncStorage} from 'react-native';
import store from '../store';

export const apiRoot = 'http://portal.janasevanakendra.com/';

export const getMahagramDetails = (payload) => {
  let type = '';
  const formData = new FormData();

  formData.append('agent_email', store.getState().login.agentEmail);

  return axios
    .post(apiRoot + 'api/agent-app-getdetails', formData, {
      headers: {
        Authorization: 'Bearer ' + store.getState().login.bearerToken,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((result) => {
      console.log(result, '== StepOne result ==');
      return result;
    });
};

export const stepOne = (payload) => {
  let type = '';
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('mobileno', payload.mobile);
  formData.append('agent_email', store.getState().login.agentEmail);

  return axios
    .post(apiRoot + 'api/agent-qr-moneytransfer-step1', formData, {
      headers: {
        Authorization: 'Bearer ' + store.getState().login.bearerToken,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((result) => {
      console.log(result, '== StepOne result ==');
      return result;
    });
};

export const stepTwo = (payload) => {
  let type = '';
  const formData = new FormData();
  formData.append('orderid', payload.orderId);
  formData.append('id', payload.insertedId);
  formData.append('date', payload.paidDate);
  formData.append('amount', payload.amount);
  formData.append('agent_email', store.getState().login.agentEmail);

  return axios
    .post(apiRoot + 'api/agent-qr-moneytransfer-step2', formData, {
      headers: {
        Authorization: 'Bearer ' + store.getState().login.bearerToken,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((result) => {
      console.log(result, '== StepOne result ==');
      return result;
    });
};

export const getProfile = (payload) => {
  let type = '';
  const formData = new FormData();

  formData.append('agent_email', store.getState().login.agentEmail);
  formData.append('extraData', payload.micro_atm_failed_data);
  return axios
    .post(apiRoot + 'api/agent-profile-details', formData, {
      headers: {
        Authorization: 'Bearer ' + store.getState().login.bearerToken,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((result) => {
      console.log(result, '== Profile result ==');
      return result;
    });
};

export const getReports = (payload) => {
  let type = '';
  const formData = new FormData();

  formData.append('agent_email', store.getState().login.agentEmail);

  return axios
    .post(apiRoot + 'api/agent-qr-transaction-report', formData, {
      headers: {
        Authorization: 'Bearer ' + store.getState().login.bearerToken,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((result) => {
      console.log(result, '== reports result ==');
      return result;
    });
};

export const failedCall = (payload) => {
  let type = '';
  const formData = new FormData();
  formData.append('id', payload.insertedId);
  formData.append('agent_email', store.getState().login.agentEmail);

  return axios
    .post(apiRoot + 'api/agent-qr-failed', formData, {
      headers: {
        Authorization: 'Bearer ' + store.getState().login.bearerToken,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((result) => {
      console.log(result, '== failed result ==');
      return result;
    });
};

export const getBillAmount = (payload) => {
  const formData = new FormData();

  formData.append('service', payload.service);
  formData.append('consumerno', payload.consumerno);
  formData.append('consumer_id', payload.consumer_id);
  formData.append('landline', payload.landline);
  formData.append('vehicleno', payload.vehicleno);
  formData.append('billerid', payload.billerid);
  
  formData.append('agent_email', store.getState().login.agentEmail);
  return axios
    .post(apiRoot + 'api/agent-app-icici-GetBillAmount', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== wallet request result ==');
      return result;
    });
};

export const settlementSetupValidation = (payload) => {
  // const formData = new FormData();
  // formData.append('bankname', payload.settlement_setup_bank_name);
  // formData.append('branch', payload.settlement_setup_bank_branch);
  // formData.append('ifsc', payload.settlement_setup_ifsc_code);
  // formData.append('accountname', payload.settlement_setup_account_name);
  // formData.append('accountno', payload.settlement_setup_account_number);
  // formData.append('image', payload.settlement_setup_base64);
  // formData.append('agent_email', store.getState().login.agentEmail);
  let JsonData = {
    bankname: payload.settlement_setup_bank_name,
    branch: payload.settlement_setup_bank_branch,
    ifsc: payload.settlement_setup_ifsc_code,
    accountname: payload.settlement_setup_account_name,
    accountno: payload.settlement_setup_account_number,
    image: payload.settlement_setup_base64,
    agent_email: store.getState().login.agentEmail,
  };
  console.log(JsonData);
  return axios
    .post(apiRoot + 'api/agent-app-AddsettlementDetails', JsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((result) => {
      console.log(result, '== wallet request result ==');
      return result;
    });
};

export const forgot_password_resetpassword = (payload) => {
  const formData = new FormData();

  // here agent email is different since it is a pasword reset for agent function

  formData.append('password', payload.password);
  formData.append('confirmpassword', payload.repassword);
  formData.append('agent_email', payload.agent_email);
  return axios
    .post(apiRoot + 'api/agent-Update-password', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== forgot password reset request result ==');
      return result;
    });
};


export const verifyOTP_MoneyTransfer = (payload) => {
  const formData = new FormData();

  

  formData.append('otp', payload.otp);
  formData.append('sendno', payload.mobileno);
  formData.append('agent_email',  store.getState().login.agentEmail);
  return axios
    .post(apiRoot + 'api/agent/moneyTransferRequest/verifyOTP', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== verify otp result ==');
      return result;
    });
};

export const verifyNo_MoneyTransfer = (payload) => {
  const formData = new FormData();

  

  
  formData.append('sendno', payload.mobileno);
  formData.append('agent_email',  store.getState().login.agentEmail);
  return axios
    .post(apiRoot + 'api/agent/moneyTransferRequest/verifyno', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== verify number result ==');
      return result;
    });
};


export const resendOTP_MoneyTransfer = (payload) => {
  const formData = new FormData();

  

  
  formData.append('sendno', payload.mobileno);
  formData.append('agent_email',  store.getState().login.agentEmail);
  return axios
    .post(apiRoot + 'api/agent/moneyTransferRequest/resendOtp', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== resend otp result ==');
      return result;
    });
};


export const forgot_password_email = (payload) => {
  const formData = new FormData();

  // here agent email is different since it is a pasword reset for agent function
  formData.append('agent_email', payload.emailid);
  return axios
    .post(apiRoot + 'api/get-otpforgotpassword', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== forgot password email request result ==');
      return result;
    });
};




export const getBCCertificateFile = () => {
  let url =
    apiRoot +
    'api/agent-bccertificate/' +
    store.getState().login.agentEmail
  ;
  let response = axios.get(url);

  console.log('BC Certificate Details', response);
  return response;
};


export const getDashboardDetails = () => {
  let url =
    apiRoot +
    'api/agent-subagentslist/' +
    store.getState().login.agentEmail
  ;
  let response = axios.get(url);

  console.log('Dashboard Details', response);
  return response;
};

export const forgot_password_otpcode = (payload) => {
  const formData = new FormData();

  // here agent email is different since it is a pasword reset for agent function
  formData.append('otp', payload.otp);
  formData.append('agent_email', payload.agent_email);
  return axios
    .post(apiRoot + 'api/get-otpchecking', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== forgot password otp request result ==');
      return result;
    });
};

export const mahagramMPosTransfer = (payload) => {
  let sendData = {
    data: payload,
    agent_email: store.getState().login.agentEmail,
  };

  return axios
    .post(apiRoot + 'api/agent-app-addwithdrawdetails', sendData, {
      headers: {
        Authorization: 'Bearer ' + store.getState().login.bearerToken,
        'Content-Type': 'application/json',
      },
    })
    .then((result) => {
      console.log(result, '== Mahagram transaction result ==');
      return result;
    });
};

export const iciciPosTransfer = (payload) => {
  let sendData = {
    data: JSON.parse(JSON.stringify(payload)),
    agent_email: store.getState().login.agentEmail,
  };

  return axios
    .post(apiRoot + 'api/agent-app-icicaddwithdrawdetails', sendData, {
      headers: {
        Authorization: 'Bearer ' + store.getState().login.bearerToken,
        'Content-Type': 'application/json',
      },
    })
    .then((result) => {
      console.log(result, '== icici transaction result ==');
      return result;
    });
};

export const getMahagramReports = () => {
  let response = axios.get(
    apiRoot +
      'api/agent-list-addwithdrawdetails/' +
      store.getState().login.agentEmail,
    {
      headers: {
        Authorization: 'Bearer ' + store.getState().login.bearerToken,
      },
    },
  );

  console.log('mahagram report Details', response);
  return response;
};

export const getAEPSReports = () => {
  let url =
    apiRoot +
    'api/agent-listHistoryAepsTransactions/' +
    store.getState().login.agentEmail
  ;
  let response = axios.get(url);

  console.log('mahagram AEPS report Details', response);
  return response;
};


export const agentHistory_Dashboard = (id) => {
  let url =
    apiRoot +
    'api/agent-Txnhistory-subagents/' +
    store.getState().login.agentEmail+'/'+id
  ;
  let response = axios.get(url);

  console.log('mahagram AEPS report Details', response);
  return response;
};






export const getIciciReports = () => {
  let response = axios.get(
    apiRoot +
      'api/agent-app-listicicaddwithdrawdetails/' +
      store.getState().login.agentEmail,
    {
      headers: {
        Authorization: 'Bearer ' + store.getState().login.bearerToken,
      },
    },
  );

  console.log('mahagram report Details', response);
  return response;
};

export const vehicleCommissionHistoryList_Insurance = () => {
  let url =
    apiRoot +
    'api/agent-List-commission-request/' +
    store.getState().login.agentEmail +
    '/vehicle';
  let response = axios.get(url);

  console.log('settlement history list Details', response);
  return response;
};






export const healthCommissionHistoryList_Insurance = () => {
  let url =
    apiRoot +
    'api/agent-List-commission-request/' +
    store.getState().login.agentEmail +
    '/health';
  let response = axios.get(url);

  console.log('settlement history list Details', response);
  return response;
};

export const getNewFastagList = () => {
  let url = apiRoot + 'api/getFasttagvehicleType';
  let response = axios.get(url);

  console.log('new fastag list Details', response);
  return response;
};

export const getNewFastagCategoryList = () => {
  let url = apiRoot + 'api/agent-app-icici-getFasttagBillers';
  let response = axios.get(url);

  console.log('new fastag list Details', response);
  return response;
};



export const getFastagRechargeUserList = () => {
  let url =
    apiRoot + 'api/agent-listFasttagUsers/' + store.getState().login.agentEmail;
  let response = axios.get(url);

  console.log(' fastag  recharge user list Details', response);
  return response;
};




export const fastagRegistrationHistoryList_Fastag = () => {
  let url =
    apiRoot + 'api/agent-listHistoryFasttag/' + store.getState().login.agentEmail;
  let response = axios.get(url);

  console.log(' fastag  recharge user list Details', response);
  return response;
};

export const fastagRechargeHistoryList_Fastag = () => {
  let url =
    apiRoot + 'api/agent-listHistoryFasttagRecharge/' + store.getState().login.agentEmail;
  let response = axios.get(url);

  console.log(' fastag  recharge user list Details', response);
  return response;
};


export const fastagRechargeHistoryList_Icici_Fastag = () => {
  let url =
    apiRoot + 'api/agent-app-icici-listHistoryFasttag/' + store.getState().login.agentEmail;
  let response = axios.get(url);

  console.log(' fastag  recharge icici list Details', response);
  return response;
};


export const getIndividual_FastagRecharge_UserDetails = (id) => {
  let url =
    apiRoot +
    'api/getFasttagUserdetails/' +
    store.getState().login.agentEmail +
    '/' +
    id;
  let response = axios.get(url);

  console.log(' fastag  recharge individual user Details', response);
  return response;
};

export const travelCommissionHistoryList_Insurance = () => {
  let url =
    apiRoot +
    'api/agent-List-commission-request/' +
    store.getState().login.agentEmail +
    '/travel';
  let response = axios.get(url);

  console.log('settlement history list Details', response);
  return response;
};

export const getCompanyDetails_commission_request_vehicle = () => {
  let url = apiRoot + 'api/getcompanyVehicle';

  let response = axios.get(url);

  console.log(url, response, 'company names vehicle commision request');

  return response;
};

export const getCompanyDetails_commission_request_health = () => {
  let url = apiRoot + 'api/getcompanyhealth';

  let response = axios.get(url);

  console.log(url, response, 'company names health commision request');

  return response;
};

export const getCompanyDetails_commission_request_travel = () => {
  let url = apiRoot + 'api/getcompanyTravel';

  let response = axios.get(url);

  console.log(url, response, 'company names travel commision request');

  return response;
};

export const newFastag_Fastag = (payload) => {
  const formData = new FormData();

  formData.append(
    'vehicle_class',
    payload.fastag_newfastag_applyfor.toString(),
  );
  formData.append(
    'fasttagno',
    payload.fastag_newfastag_fastag_number.toString(),
  );
  formData.append('mobile', payload.fastag_newfastag_mobile_number.toString());
  formData.append('name', payload.fastag_newfastag_name.toString());
  formData.append(
    'service_charge',
    payload.fastag_newfastag_service_charge.toString(),
  );
  formData.append('address', payload.fastag_newfastag_address.toString());
  formData.append('amount', payload.fastag_newfastag_amount.toString());

  formData.append(
    'vehicle_no',
    payload.fastag_newfastag_vehicle_number.toString(),
  );
  formData.append(
    'commercial_type',
    payload.fastag_newfastag_commercial_type.toString(),
  );

  formData.append('rc_front', payload.fastag_newfastag_front_of_rc_file);
  formData.append('rc_back', payload.fastag_newfastag_back_of_rc_file);
  formData.append('fasttagphoto', payload.fastag_newfastag_fastag_photo_file);
  formData.append(
    'paytmmobile',
    payload.fastag_newfastag_paytm_mobile_number.toString(),
  );

  formData.append('agent_email', store.getState().login.agentEmail);

  return axios
    .post(apiRoot + 'api/agent-AppFasttagRequest', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    })
    .then((result) => {
      console.log(result, '== vehicle insurance ==');
      return result;
    });
};



export const updateKYCDetails = (payload) => {
  const formData = new FormData();

  formData.append(
    'name',
    payload.kyc_update_name.toString(),
  );
  formData.append(
    'mobileno',
    payload.kyc_update_mobileno.toString(),
  );
  formData.append('address', payload.kyc_update_address.toString());
  formData.append('prooftype', payload.kyc_update_proof_type_selected_value.toString());
  // formData.append(
  //   'idno',
  //   payload.kyc_update_id_proof_value.toString(),
  // );
 

  formData.append('proof', payload.kyc_update_document_file);

  formData.append('useremail', store.getState().login.agentEmail);

  return axios
    .post(apiRoot + 'api/agent-submitCustomer-kycMoneytransfer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    })
    .then((result) => {
      console.log(result, '== vehicle insurance ==');
      return result;
    });
};





export const commission_request_vehicle_postData = (payload) => {
  const formData = new FormData();

  formData.append(
    'insurance_company',
    payload.commission_request_vehicle_company_id.toString(),
  );
  formData.append('vehicle_no', payload.commission_request_vehicle_number);
  formData.append('vehicletype', payload.commission_request_vehicle_name);
  formData.append(
    'customer_name',
    payload.commission_request_vehicle_customer_name,
  );
  formData.append(
    'policy_no',
    payload.commission_request_vehicle_policy_number,
  );
  formData.append('tp', parseInt(payload.commission_request_vehicle_tp));

  formData.append('od', parseInt(payload.commission_request_vehicle_od));
  formData.append(
    'total_premium',
    parseInt(payload.commission_request_vehicle_amount),
  );
  formData.append('insurance_copy', payload.commission_request_vehicle_file),
    formData.append('agent_email', store.getState().login.agentEmail);

  return axios
    .post(
      apiRoot + 'api/agent-Add-vehicleinsurance-commissionrequest',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      },
    )
    .then((result) => {
      console.log(result, '== vehicle insurance ==');
      return result;
    });
};

export const fastagRecharge_fastag = (payload) => {
  const formData = new FormData();

  formData.append('name', payload.fastag_fastag_recharge_name);
  formData.append('mobile', payload.fastag_fastag_recharge_mobile_number);
  formData.append('address', payload.fastag_fastag_recharge_address);
  formData.append(
    'vehicle_class',
    payload.fastag_fastag_recharge_vehicle_class_id,
  );
  formData.append('fasttagno', payload.fastag_fastag_recharge_fastag_number);
  formData.append('reg_user_id', payload.fastag_fastag_recharge_user_id);
  formData.append('vehicle_no', payload.fastag_fastag_recharge_vehicle_number);
  formData.append('amount', payload.fastag_fastag_recharge_amount);
  formData.append('agent_email', store.getState().login.agentEmail);
  return axios
    .post(
      apiRoot + 'api/agent-AppFasttagRechargeRequest',
      formData,
      {
        headers: {'Content-Type': 'multipart/form-data'},
      },
    )
    .then((result) => {
      console.log(result, '== health insurance ==');
      return result;
    });
};

export const commission_request_health_postData = (payload) => {
  const formData = new FormData();

  formData.append(
    'insurancy_company',
    payload.commission_request_health_company_id,
  );
  formData.append(
    'customer_name',
    payload.commission_request_health_customer_name,
  );
  formData.append(
    'customer_mobile_number',
    payload.commission_request_health_customer_mobileno,
  );
  formData.append('policy_no', payload.commission_request_health_policy_number);
  formData.append('amount', payload.commission_request_health_amount);
  formData.append('agent_email', store.getState().login.agentEmail);
  return axios
    .post(
      apiRoot + 'api/agent-Add-healthinsurance-commissionrequest',
      formData,
      {
        headers: {'Content-Type': 'multipart/form-data'},
      },
    )
    .then((result) => {
      console.log(result, '== health insurance ==');
      return result;
    });
};

export const commission_request_travel_postData = (payload) => {
  const formData = new FormData();

  formData.append(
    'insurancy_company',
    payload.commission_request_travel_company_id,
  );
  formData.append(
    'customer_name',
    payload.commission_request_travel_customer_name,
  );
  formData.append(
    'customer_mobile_number',
    payload.commission_request_travel_customer_mobileno,
  );
  formData.append('policy_no', payload.commission_request_travel_policy_number);
  formData.append('amount', payload.commission_request_travel_amount);
  formData.append('agent_email', store.getState().login.agentEmail);
  return axios
    .post(
      apiRoot + 'api/agent-Add-travelinsurance-commissionrequest',
      formData,
      {
        headers: {'Content-Type': 'multipart/form-data'},
      },
    )
    .then((result) => {
      console.log(result, '== travel insurance ==');
      return result;
    });
};





export const teacherIndRegistration = (payload) => {
  const formData = new FormData();

  formData.append('name', payload.teacherind_name);
  formData.append('mobile', payload.teacherind_mobile_number);
  //formData.append('address', payload.teacherind_address);
  formData.append('email', payload.teacherind_email_id);
 // formData.append('district', payload.teacherind_district);
 // formData.append('taluk', payload.teacherind_taluk);
  formData.append('course_name', payload.teacherind_course_name);
  //formData.append('course_institution', payload.teacherind_institution);
  formData.append('course_semester', payload.teacherind_course_semester);
  formData.append('course_tutionfor', payload.teacherind_course_tution_for);
  formData.append('agent_email', store.getState().login.agentEmail);

  return axios
    .post(apiRoot + 'api/agent-submitTeachersA', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== teacherInd request result ==');
      return result;
    });
};


export const getTeacherIndRegistrationHistory_TeacherInd = () => {
  let url = apiRoot + 'api/agent-listsubmitTeachersA/'+store.getState().login.agentEmail;

  let response = axios.get(url);

  console.log(url, response, 'company names health commision request');

  return response;
};





export const getAccountBalance = () => {
  let url =
    apiRoot +
    'api/microatm-agent-balance-view/' +
    store.getState().login.agentEmail;
  let response = axios.get(url);

  console.log(url, response, 'aaaa');

  return response;
};

export const listBeneficiaryList_MoneyTransfer = () => {
  let url =
    apiRoot +
    'api/agent-list-beneficiersList/' +
    store.getState().login.agentEmail;
  let response = axios.get(url);

  console.log(url, response, 'aaaa');

  return response;
};

export const addBeneficiary_MoneyTransfer = (payload) => {
  let type = '';
  const formData = new FormData();
  formData.append('name', payload.money_transfer_add_Beneficiaryname);
  formData.append('account_no', payload.money_transfer_add_BeneficiaryAccNo);
  formData.append('bank_name', payload.money_transfer_add_BeneficiaryBank);
  formData.append('bank_branch', payload.money_transfer_add_BeneficiaryBranch);
  formData.append('ifsc', payload.money_transfer_add_BeneficiaryIfsc);
  formData.append('agent_email', store.getState().login.agentEmail);

  if (payload.money_transfer_add_mode == 'edit') {
    type = 'agent-app-EditBenificier';
    formData.append('id', payload.money_transfer_edit_id);
  } else {
    type = 'agent-app-addBenificier';
  }

  return axios
    .post(apiRoot + 'api/' + type, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== add beneficiary result ==');
      return result;
    });
};

export const deleteFromList_MoneyTransfer = (id) => {
  const formData = new FormData();
  formData.append('agent_email', store.getState().login.agentEmail);
  formData.append('id', id);

  return axios
    .post(apiRoot + 'api/agent-app-deleteBenificier', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== list  After Delete beneficiary result ==');
      return result;
    });
};

//----not using function-----
// export const transferAmountToBeneficiary_MoneyTransfer = (id)=> {
//   const formData = new FormData();

//    formData.append('id',id)
//       if(store.getState().login.userDetails && store.getState().login.userDetails.user)
//  {
//   formData.append('user',store.getState().login.userDetails.user)
//  }
//    formData.append("request_name", "delete_beneficiary");

//  return axios
//    .post(apiRoot + "wallet/applogin.php", formData, {
//      headers: { "Content-Type": "multipart/form-data" }
//    })
//    .then(result => {
//      console.log(result, "== transfer amount to beneficiary result ==");
//      return result;
//    });
// };

export const walletRequest_MoneyTransfer = (payload) => {
  const formData = new FormData();

  formData.append('amount', payload.wallet_request_Amount);

  formData.append('type', payload.wallet_request_type);
  formData.append('date', payload.wallet_request_DateofPayment);
  formData.append('remarks', payload.wallet_request_Message);
  formData.append('referenceno', payload.wallet_request_BankReferenceNumber);

  formData.append('agent_email', store.getState().login.agentEmail);

  return axios
    .post(apiRoot + 'api/agent-app-PaywalletRequest', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== wallet request result ==');
      return result;
    });
};

export const walletList_MoneyTransfer = () => {
  let url =
    apiRoot +
    'api/agent-list-walletrequest/' +
    store.getState().login.agentEmail;
  let response = axios.get(url);

  console.log('transer history list Details', response);
  return response;
};

export const settlementHistoryList_Settlement = () => {
  let url =
    apiRoot +
    'api/agent-list-txnsettlementList/' +
    store.getState().login.agentEmail;
  let response = axios.get(url);

  console.log('settlement history list Details', response);
  return response;
};

export const moneyTransferRequest_MoneyTransfer = (payload) => {
  const formData = new FormData();
  formData.append(
    'beneficiaryname',
    payload.money_transfer_transfer_Beneficiaryname,
  );
  formData.append(
    'beneficiaryaccno',
    payload.money_transfer_transfer_BeneficiaryAccNo,
  );
  formData.append(
    'beneficiarybank',
    payload.money_transfer_transfer_BeneficiaryBank,
  );
  formData.append(
    'beneficiarybranch',
    payload.money_transfer_transfer_BeneficiaryBranch,
  );
  formData.append(
    'beneficiaryifsc',
    payload.money_transfer_transfer_BeneficiaryIfsc,
  );
  formData.append('amount', payload.money_transfer_transfer_amount);
  formData.append(
    'purpose',
    payload.money_transfer_transfer_purpose !== ''
      ? payload.money_transfer_transfer_purpose
      : 'Money Transfer',
  );
  formData.append(
    'sender_name',
    payload.money_transfer_transfer_sender_name,
  );
  formData.append(
    'sender_phoneno',
    payload.money_transfer_transfer_sender_mobile_no,
  );

  formData.append('date', payload.money_transfer_transfer_DateofPayment);
  formData.append('agent_email', store.getState().login.agentEmail);
  //'api/agent-app-PayMoneyTransfer'
  return axios
    .post(apiRoot + 'api/agent-app-testPayMoneyTransfer', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== transfer amount to beneficiary result ==');
      return result;
    });
};

export const moneyTransferList_MoneyTransfer = () => {
  let url =
    apiRoot +
    'api/agent-list-moneytransferTxn/' +
    store.getState().login.agentEmail;
  let response = axios.get(url);

  console.log('transer history list Details', response);
  return response;
};

export const RechargeHistoryList_MobileDth = () => {
  let url =
    apiRoot + 'api/recharge-history/' + store.getState().login.userDetails.user;
  let response = axios.get(url);

  console.log('Provider list Details', response);
  return response;
};

export const getProviderList_MobileDthRecharge = () => {
  let response = axios.get(apiRoot + 'api/mobile-recharge-provider');

  console.log('Provider list Details', response);
  return response;
};

export const getRegionList_MobileDthRecharge = () => {
  let response = axios.get(apiRoot + 'api/mobile-recharge-region');

  console.log('Provider list Details', response);
  return response;
};

export const mobileRechargeRequest_MobileDthRecharge = (payload) => {
  const formData = new FormData();
  formData.append('mobile_number', payload.mobile_mobileNum);
  formData.append('provider', payload.mobile_providerId);
  formData.append('region', payload.mobile_regionName);
  formData.append('amount', payload.mobile_amount);
  formData.append('request_name', 'mobile_recharge');
  formData.append('agent_email', store.getState().login.agentEmail);

  return axios
    .post(apiRoot + 'api/agent-app-PayMobile', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== mobile recharge result ==');
      return result;
    });
};

export const getDTHList_MobileDthRecharge = () => {
  let response = axios.get(apiRoot + 'api/dth-recharge-provider');

  console.log('DTH Provider list Details', response);
  return response;
};

export const DthRechargeRequest_MobileDthRecharge = (payload) => {
  const formData = new FormData();

  formData.append('provider', payload.dth_DthProviderId);
  formData.append('customer_id', payload.dth_customerId);
  formData.append('amount', payload.dth_amount);
  formData.append('request_name', 'dth_recharge');
  formData.append('agent_email', store.getState().login.agentEmail);

  return axios
    .post(apiRoot + 'api/agent-app-PayDTH', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== mobile recharge result ==');
      return result;
    });
};

export const ksebRequest_billPayment = (payload) => {
  const formData = new FormData();

  formData.append('consumer_id', payload.kseb_consumerId);

  formData.append('amount', payload.kseb_amount);

  formData.append('agent_email', store.getState().login.agentEmail);
  // if (store.getState().login.userDetails && store.getState().login.userDetails.user) {
  // 	formData.append('user', store.getState().login.userDetails.user);
  // }

  return axios
    .post(apiRoot + 'api/agent-app-icici-PayElectrictybill', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== Kseb bill result ==');
      return result;
    });
};

export const KsebHistoryList_BillPayment = () => {
  let url =
    apiRoot +
    'api/agent-list-electricityTxn/' +
    store.getState().login.agentEmail;
  let response = axios.get(url);

  console.log('kseb history list Details', response);
  return response;
};

export const WaterAuthoriy_Request_billPayment = (payload) => {
  const formData = new FormData();

  // formData.append("name", payload.water_auth_Name);
  //formData.append("consumer_id", payload.water_auth_consumerId);
  formData.append('consumerno', payload.water_auth_consumerNumber);
  //formData.append("mobile_number", payload.water_auth_mobileNum);
  // formData.append("due_date", payload.water_auth_dueDate);
  // formData.append("bill_number", payload.water_auth_billNumber);
  formData.append('amount', payload.water_auth_amount);
  //formData.append("section", payload.water_auth_section);
  //formData.append("request_name", "water_bill");
  formData.append('agent_email', store.getState().login.agentEmail);
  // if (
  //   store.getState().login.userDetails &&
  //   store.getState().login.userDetails.user
  // ) {
  //   formData.append("user", store.getState().login.userDetails.user);
  // }

  return axios
    .post(apiRoot + 'api/agent-app-icici-PayWaterbill', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== water bill result ==');
      return result;
    });
};

export const WaterAuthorityHistoryList_BillPayment = () => {
  let url =
    apiRoot +
    'api/agent-list-waterbillTxn/' +
    store.getState().login.agentEmail;
  let response = axios.get(url);

  console.log('water authority history list Details', response);
  return response;
};

export const asianet_payment_billPayment = (payload) => {
  const formData = new FormData();

  formData.append('customer_name', payload.asianet_customerName);
  formData.append('mobile_number', payload.asianet_mobileNum);
  formData.append('address', payload.asianet_address);
  formData.append('amount', payload.asianet_amount);
  formData.append('subscriberId', payload.asianet_subscriberId);
  formData.append('type', payload.asianet_type);
  formData.append('agent_email', store.getState().login.agentEmail);
  // 'api/agent-app-PayAsianetbill'
  return axios
    .post(apiRoot + 'api/agent-app-icici-PayAsianetbill', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== asianet bill result ==');
      return result;
    });
};

export const AsianetHistoryList_BillPayment = () => {
  let url =
    apiRoot +
    'api/agent-list-asianetbillTxn/' +
    store.getState().login.agentEmail;
  let response = axios.get(url);

  console.log('asianet history list Details', response);
  return response;
};

export const mobileHistoryList_BillPayment = () => {
  let url =
    apiRoot +
    'api/agent-list-mobilerechargeTxn/' +
    store.getState().login.agentEmail;
  let response = axios.get(url);

  console.log('asianet history list Details', response);
  return response;
};

export const dthHistoryList_BillPayment = () => {
  let url =
    apiRoot +
    'api/agent-list-dthrechargeTxn/' +
    store.getState().login.agentEmail;
  let response = axios.get(url);

  console.log('asianet history list Details', response);
  return response;
};

export const bsnl_Multi_billPayment = (payload) => {
  const formData = new FormData();

  // formData.append("date", payload.bsnl_date);
  // formData.append("name", payload.bsnl_Name);
  // formData.append("mobile_number", payload.bsnl_mobileNum);
  formData.append('landline', payload.bsnl_landlineWthCode);
  formData.append('account_number', payload.bsnl_accountNumber);
  //formData.append("due_date", payload.bsnl_dueDate);
  // formData.append("selected_operator", payload.bsnl_selectedOperator);
  formData.append('amount', payload.bsnl_amount);
  formData.append('connection_type', payload.bsnl_connectionType);
  // formData.append("request_name", "telephone_bill");
  formData.append('agent_email', store.getState().login.agentEmail);

  return axios
    .post(apiRoot + 'api/agent-app-icici-PayTelephonebill', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== telephone bill result ==');
      return result;
    });
};

export const fastag_icici_billPayment = (payload) => {
  const formData = new FormData();

  
  formData.append('name', payload.name);
  formData.append('mobileno', payload.mobileno);
  formData.append('vehicleno', payload.vehicleno);
  formData.append('biller_category', payload.biller_category);
  formData.append('amount', payload.amount);

  formData.append('agent_email', store.getState().login.agentEmail);

  return axios
    .post(apiRoot + 'api/agent-app-icici-PayFasttagbill', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== fastag bill result ==');
      return result;
    });
};




export const BsnlHistoryList_BillPayment = () => {
  let url =
    apiRoot +
    'api/agent-list-telephoneTxn/' +
    store.getState().login.agentEmail;
  let response = axios.get(url);

  console.log('telephone history list Details', response);
  return response;
};

export const makeSettlement_Settlement = (payload) => {
  const formData = new FormData();

  formData.append('amount', payload.settlement_transfer_amount);

  formData.append('agent_email', store.getState().login.agentEmail);

  return axios
    .post(apiRoot + 'api/agent-app-MakeSettlement', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== Settlement result ==');
      return result;
    });
};

export const profile_page = (payload) => {
  const formData = new FormData();

  // formData.append("username",payload.customerName);
  // formData.append("company", payload.mobileNum);
  // formData.append("place", payload.address);
  // formData.append("postoffice",payload.amount);
  // formData.append("district",payload.customerName);
  // formData.append("centername", payload.mobileNum);
  // formData.append("pincode", payload.address);
  // formData.append("mobileNumber",payload.amount);
  // formData.append("emailid",payload.amount);

  formData.append('name', payload.name);
  formData.append('address', payload.address);
  formData.append('gender', payload.gender);
  formData.append('dob', payload.dob);
  formData.append('pincode', payload.pincode);
  formData.append('id_type', payload.id_type);
  formData.append('id_number', payload.id_number);
  formData.append('agent_email', 'fotomaxkhd3@gmail.com');
  if (payload.profile_pic) {
    formData.append('profile_pic', payload.profile_pic);
  }

  formData.append('request_name', 'profile_page');
  if (
    store.getState().login.userDetails &&
    store.getState().login.userDetails.user
  ) {
    formData.append('user', store.getState().login.userDetails.user);
  }

  return axios
    .post(apiRoot + 'api/cross-user-profile-update', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== profile result ==');
      return result;
    });
};

export const get_profile_page_details = () => {
  let url =
    apiRoot + 'api/get-profile-data/' + store.getState().login.userDetails.user;
  let response = axios.get(url);

  console.log(url, 'aaaa');
  return response;
};

export const change_Password = (payload) => {
  const formData = new FormData();

  formData.append('old_password', payload.oldpassword);
  formData.append('new_password', payload.newpassword);
  formData.append('agent_email', 'fotomaxkhd3@gmail.com');

  formData.append('request_name', 'change_password');
  if (
    store.getState().login.userDetails &&
    store.getState().login.userDetails.user
  ) {
    formData.append('user', store.getState().login.userDetails.user);
  }

  return axios
    .post(apiRoot + 'api/change-password', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== change password ==');
      return result;
    });
};

export const change_Mpin = (payload) => {
  const formData = new FormData();

  formData.append('old_mpin', payload.oldmpin);
  formData.append('new_mpin', payload.newmpin);
  formData.append('agent_email', 'fotomaxkhd3@gmail.com');
  formData.append('request_name', 'change_mpin');
  if (
    store.getState().login.userDetails &&
    store.getState().login.userDetails.user
  ) {
    formData.append('user', store.getState().login.userDetails.user);
  }

  return axios
    .post(apiRoot + 'api/change-mpin', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((result) => {
      console.log(result, '== change mpin ==');
      return result;
    });
};

export const allTransactionHistoryList = () => {
  let url =
    apiRoot +
    'api/agent-list-transactions/' +
    store.getState().login.agentEmail;
  let response = axios.get(url);

  console.log('all history list Details', response);
  return response;
};

export const adminPanelList = () => {
  let url =
    apiRoot +
    'wallet/applogin.php?all_transactions=' +
    store.getState().login.userDetails.user;
  let response = axios.get(url);

  console.log('Admin Panel list Details', response);
  return response;
};
