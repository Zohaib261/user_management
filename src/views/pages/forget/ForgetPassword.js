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
const api_url = myConstClass.api_url;

class ForgetPassword extends Component {

    constructor(props) {
        super(props);
        this.user_id = React.createRef();
        this.state = { 
            user_id: '',
            user_email:'',
            error:false,
            errorMessage:'',
            messageType:''
         };
         this.submitUserID   = this.submitUserID.bind(this);
         this.changeUserId   = this.changeUserId.bind(this);
         this.changeEmail    = this.changeEmail.bind(this);
         this.submitEmail    = this.submitEmail.bind(this);
         this.Redirect       = this.Redirect.bind(this);
      }

    submitUserID(event){
        event.preventDefault();
        const user_data = this.state;
        const user_id   = user_data.user_id;
        
        if(user_id === ""){
            this.setState({
                errorMessage:'Please Enter User Id',
                messageType: 'Error',
                error:true
            })
            return false;
        }

       axios.post(`${api_url}api.php?type=resetPassword`, {
            "userid":user_id
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
                    errorMessage:message,
                    messageType: 'Success',
                    error:true
                })
            }
           
        }, (error) => {
            console.log(error);
          })
    }


    submitEmail(event){
      event.preventDefault();
      const user_data = this.state;
      const user_email  = user_data.user_email
      
      if(user_email === ""){
          this.setState({
              errorMessage:'Please Enter Email',
              messageType: 'Error',
              error:true
          })
          return false;
      }

     axios.post(`${api_url}api.php?type=getUserID`, {
          "email":user_email
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
                  errorMessage:message,
                  messageType: 'Success',
                  error:true
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

    changeEmail(event){
        this.setState({
            user_email: event.target.value
        });
    }

    Redirect(){
      console.clear();
      this.setState({...this.state, error: false,messageType:""});
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
                  <CForm onSubmit={this.submitUserID}>
                    <h3>Forget Password?</h3>
                    <p className="text-muted">Please Provide yout user ID below and we will send email link to reset pasword</p>
                    
                     
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="User ID" autoComplete="user_id"
                      value={this.state.user_id}
                      onChange = {this.changeUserId}
                      />
                       <CCol xs="6">
                        <CButton type="submit" color="primary" className="px-4">Submit</CButton>
                      </CCol>
                    </CInputGroup>
                    </CForm>  
                    <CForm onSubmit={this.submitEmail}>
                    <h3>Forget User ID?</h3>
                    <p className="text-muted">Please Provide yout e-mail address below and we will send ID to your email</p>
                    <CInputGroup className="mb-6">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="email" placeholder="EMail" autoComplete="current-email" 
                      value={this.state.user_email}
                      onChange = {this.changeEmail} />
                      <CCol xs="6">
                        <CButton type="submit" color="primary" className="px-4">Submit</CButton>
                      </CCol>
                    </CInputGroup>
                    
                  </CForm>
                  <CCol xs="12" className="text-center">
                      <Link to="/login">
                        <CButton color="link" className="px-0">Back to Login</CButton>
                        </Link>
                      </CCol>
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

export default ForgetPassword
