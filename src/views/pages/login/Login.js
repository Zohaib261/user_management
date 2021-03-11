import React,{Component} from 'react'
import { Link } from 'react-router-dom'
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
import {loadReCaptcha ,ReCaptcha  } from 'react-recaptcha-google'
const api_url = myConstClass.api_url;

class Login extends Component {

    constructor(props) {
        super(props);
        this.user_id = React.createRef();
        this.state = { 
            user_id: '',
            user_pass:'',
            error:false,
            errorMessage:'',
            messageType:'',
            userData:'',
            recaptchaVerify:''
         };
         this.submitLogin    = this.submitLogin.bind(this);
         this.changeUserId   = this.changeUserId.bind(this);
         this.changePassword = this.changePassword.bind(this);
         this.Redirect       = this.Redirect.bind(this);
         this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
         this.verifyCallback = this.verifyCallback.bind(this);

        //get user_data
        const user_detail = localStorage.getItem("userDetail");
        if(user_detail !== null){
            const user_parse_data = JSON.parse(user_detail);
            const isVerify = user_parse_data.isVerify;
            if(isVerify === '1'){
                window.open('/',"_self");
            }

            if(isVerify === '0'){
                window.open('#/loginVeriy',"_self");
            }
            
        }
      }
      
      componentDidMount() {
        loadReCaptcha();
        if (this.captchaDemo) {
            this.captchaDemo.reset();
        }
      }

      onLoadRecaptcha() {
        if (this.captchaDemo) {
            this.captchaDemo.reset();
        }
        }
        verifyCallback(recaptchaToken) {
            if(recaptchaToken !== ''){
                this.setState({
                    recaptchaVerify:recaptchaToken
                })
            }
        }

    submitLogin(event){
        event.preventDefault();
        const user_data = this.state;
        const user_id   = user_data.user_id;
        const password  = user_data.user_pass
        const recaptcha = user_data.recaptchaVerify
        
        if(user_id === ""){
            this.setState({
                errorMessage:'Please Enter User Id',
                messageType: 'Error',
                error:true
            })
            return false;
        }

        if(password === ""){
            this.setState({
                errorMessage:'Please Enter Password',
                messageType: 'Error',
                error:true
            })
            return false;
        }
        
        if(recaptcha === ""){
            this.setState({
                errorMessage:'Invalid Captcha',
                messageType: 'Error',
                error:true
            })
            return false;
        }
      

       axios.post(`${api_url}api.php?type=login`, {
            "userid":user_id,
            "password":password
        },{
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
        }
        ).then((response) => { 
           // console.log(response.data);
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
                    errorMessage:message,
                    messageType: 'Success',
                    error:true,
                    userData:response.data.data
                })
            }
           
        }, (error) => {
            console.log(error);
          })
    }

    changeUserId(event){
        this.setState({
            user_id: event.target.value
        });
    }

    changePassword(event){
        this.setState({
            user_pass: event.target.value
        });
    }

    Redirect(){
        const stateData = this.state;
        const messageType = stateData.messageType;
        if(messageType === 'Error'){
            this.setState({...this.state, error: false,messageType:""});
            this.captchaDemo.reset();
            console.clear();
        }
        if(messageType === 'Success'){
            localStorage.setItem('userDetail',JSON.stringify(stateData.userData));
            this.setState({ error: false,messageType:""});
            window.open('#/loginVeriy',"_self");
            console.clear();
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
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="User ID" autoComplete="user_id"
                      value={this.state.user_id}
                      onChange = {this.changeUserId}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Password" autoComplete="current-password" 
                      value={this.state.user_pass}
                      onChange = {this.changePassword} />
                    </CInputGroup>
                    <ReCaptcha
                    ref={(el) => {this.captchaDemo = el;}}
                    size="normal"
                    data-theme="dark"
                    render="explicit"
                    sitekey="6LdLEWcaAAAAAO_uxDqV9VtZvm4ScEh_fp0r_v8W"
                    onloadCallback={this.onLoadRecaptcha}
                    verifyCallback={this.verifyCallback}
                />
                    <CRow>
                      <CCol xs="6">
                        <CButton type="submit" color="primary" className="px-4">Login</CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                      <Link to="/forgetPassword">
                        <CButton color="link" className="px-0">Forgot password?</CButton>
                        </Link>
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

export default Login
