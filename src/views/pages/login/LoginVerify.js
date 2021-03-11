import React,{Component} from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as myConstClass from '../../../constants.js';
import axios from "axios"
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
const api_url = myConstClass.api_url;

class LoginVerify extends Component {

    constructor(props) {
        super(props);
        this.user_id = React.createRef();
        this.state = { 
            error:false,
            errorMessage:'',
            messageType:'',
            userData:'',
            userPermission:'',
            loginKey:""
         };
         this.submitLogin    = this.submitLogin.bind(this);
         this.changeUserId   = this.changeUserId.bind(this);
         this.Redirect       = this.Redirect.bind(this);

          //get user_data
        const user_detail = localStorage.getItem("userDetail");
        if(user_detail !== null){
            const user_parse_data = JSON.parse(user_detail);
            const isVerify = user_parse_data.isVerify;
            const user_id = user_parse_data.user_id;
            this.state = {
                ...this.state, 
                user_id: user_id
             };
            if(isVerify === '1'){
                window.open('/',"_self");
            }            
        }else{
            window.open('#/login',"_self");
        }
      }
      
      

    submitLogin(event){
        event.preventDefault();
        const user_data = this.state;
        const loginKey   = user_data.loginKey;
        const user_id  = user_data.user_id
        
        if(loginKey === ""){
            this.setState({
                errorMessage:'Please Enter User Id',
                messageType: 'Error',
                error:true
            })
            return false;
        }
        
       axios.post(`${api_url}api.php?type=loginVefiy`, {
            "userid":user_id,
            "loginKey":loginKey
        },{
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
        }
        ).then((response) => { 
           console.log(response.data);
            const type = response.data.type;
            const message = response.data.message;
            if(type === "error"){
                this.setState({
                    errorMessage:message,
                    messageType: 'Error',
                    error:true
                })
            }else{
                this.setState({
                    messageType:"Success",
                    userData:response.data.data,
                    userPermission:response.data.permissions
                })
                this.Redirect();
            }
           
        }, (error) => {
            console.log(error);
          })
    }

    changeUserId(event){
        this.setState({
            loginKey: event.target.value
        });
    }

    Redirect(){
        const stateData = this.state;
        const messageType = stateData.messageType;
        if(messageType === 'Error'){
            this.setState({ error:false,messageType:""});
            console.clear();
        }
        if(messageType === 'Success'){
            localStorage.setItem('userDetail',JSON.stringify(stateData.userData));
            localStorage.setItem('userPermission',stateData.userPermission);
            this.setState({ error: false,messageType:""});
            console.clear();
            window.open('#/admindashboard',"_self");
        }
    }


    render(){
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
              <div> 
                <SweetAlert
                    show={this.state.error}
                    title={this.state.messageType}
                    text={this.state.errorMessage}
                    onConfirm={this.Redirect}
                />
            </div>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={this.submitLogin}>
                    <h1>Login Verification</h1>
                    <p className="text-muted">Verify Login Access</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Verification Key" autoComplete="login_key"
                      value={this.state.loginKey}
                      onChange = {this.changeUserId}
                      />
                    </CInputGroup>
                   
                    
                    <CRow>
                      <CCol xs="6">
                        <CButton type="submit" color="primary" className="px-4">Verify</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                  
                </CCardBody>
              </CCard>
              
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}
}

export default LoginVerify
