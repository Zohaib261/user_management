import React,{ useState,useEffect }  from 'react'
import { useHistory } from 'react-router-dom'
import { CCard, 
    CCardBody, 
    CCardHeader, 
    CCol, 
    CRow,
    CButton,
    CForm,
    CFormGroup,
    CFormText,
    CInput,
    CLabel,
    CSelect,
    CAlert,
    CInputCheckbox } from '@coreui/react'
import axios from "axios";
import * as myConstClass from '../../constants';
const api_url = myConstClass.api_url;

const Role = ({match}) => {
  const history = useHistory()
  const [newfullname, setnewfullname] = useState('')
  const [newBranch, setnewBranch] = useState('')
  const [newClient, setnewClient] = useState('')
  const [newStatus, setnewStatus] = useState('')
  const [newPermission, setnewPermission] = useState([])
  const [NameError, setNameError] = useState(false)
  const [ClientDa, setClientDa] = useState([])
  const [BranchDa, setBranchDa] = useState([])
  const [submitMessage, setsubmitMessage] = useState("")
  const [userView, setuserView] = useState(false)
  const [userAdd, setuserAdd] = useState(false)
  const [userEdit, setuserEdit] = useState(false)
  const [userDelete, setuserDelete] = useState(false)
  const [roleView, setroleView] = useState(false)
  const [roleAdd, setroleAdd] = useState(false)
  const [roleEdit, setroleEdit] = useState(false)
  const [roleDelete, setroleDelete] = useState(false)
  const [branchView, setbranchView] = useState(false)
  const [branchAdd, setbranchAdd] = useState(false)
  const [branchEdit, setbranchEdit] = useState(false)
  const [branchDelete, setbranchDelete] = useState(false)
  const [clientView, setclientView] = useState(false)
  const [clientAdd, setclientAdd] = useState(false)
  const [clientEdit, setclientEdit] = useState(false)
  const [clientDelete, setclientDelete] = useState(false)
  const [isPermissionSet, setisPermissionSet] = useState(false)
  

  useEffect(()=>{
    axios.get(`${api_url}api.php?type=singleRoleData&id=`+match.params.id)
    .then((response) => { 
        const userddData = response.data;
        const UserDetails = userddData[0];
        const userPermission = UserDetails.PermissionButton;
        setnewfullname(UserDetails.FullName);
        setnewClient(UserDetails.ClientID);
        setnewBranch(UserDetails.BranchID);
        setnewPermission(userPermission.split(','));
        setnewStatus(UserDetails.status_code);
        setisPermissionSet(true)
    }).catch(err => {
        console.log('Error: ', err);
    })
    },[match.params.id])

    const addUser = (event) =>{
        event.preventDefault();

        if(newfullname === ''){
            setNameError(true);
            return false;
        }else{
            setNameError(false);
        }

        axios.post(`${api_url}api.php?type=updateRole`, {
            "user_id":match.params.id,
            "name":newfullname,
            "permission":newPermission,
            "branch":newBranch,
            "client":newClient,
            "status":newStatus
        },{
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
        }
        ).then((response) => { 
            const user_response = response.data;
            setsubmitMessage(user_response.message);
            
           
        }).catch(err => {
            console.log('Error: ', err);
        })
  }
  
  useEffect(()=>{
    axios.get(`${api_url}api.php?type=clientData`)
    .then((response) => { 
        const clientData = response.data;
        setClientDa(clientData);
    }).catch(err => {
        console.log('Error: ', err);
    })
    },[])

    useEffect(()=>{
        axios.get(`${api_url}api.php?type=branchData`)
        .then((response) => { 
            const branchddData = response.data;
            setBranchDa(branchddData);
        }).catch(err => {
            console.log('Error: ', err);
        })
    },[])

    const handleAddrTypeChange = (e) => {
        let index;
        let isChecked = e.target.checked;
        if(isChecked){
          newPermission.push(e.target.value)
        } else {
          index = newPermission.indexOf(e.target.value)
          newPermission.splice(index, 1)
        }
        setnewPermission(newPermission);
        if(newPermission.indexOf("1") > -1){
            setuserView(true);
          }else{
              setuserView(false);
          }
          if(newPermission.indexOf("2") > -1){
            setuserAdd(true);
          }else{
            setuserAdd(false);
          }
          if(newPermission.indexOf("3") > -1){
            setuserEdit(true);
          }else{
            setuserEdit(false);
          }
          if(newPermission.indexOf("4") > -1){
              setuserDelete(true);
          }else{
            setuserDelete(false);
          }
          if(newPermission.indexOf("5") > -1){
              setroleView(true);
          }else{
            setroleView(false);
          }
          if(newPermission.indexOf("6") > -1){
              setroleAdd(true);
          }else{
            setroleAdd(false);
          }
          if(newPermission.indexOf("7") > -1){
              setroleEdit(true);
          }else{
            setroleEdit(false);
          }
          if(newPermission.indexOf("8") > -1){
              setroleDelete(true);
          }else{
            setroleDelete(false);
          }
          if(newPermission.indexOf("9") > -1){
              setclientView(true);
          }else{
            setclientView(false);
          }
          if(newPermission.indexOf("10") > -1){
              setclientAdd(true);
          }else{
            setclientAdd(false);
          }
          if(newPermission.indexOf("11") > -1){
              setclientEdit(true);
          }else{
            setclientEdit(false);
          }
          if(newPermission.indexOf("12") > -1){
              setclientDelete(true);
          }else{
            setclientDelete(false);
          }
          if(newPermission.indexOf("13") > -1){
              setbranchView(true);
          }else{
            setbranchView(false);
          }
          if(newPermission.indexOf("14") > -1){
              setbranchAdd(true);
          }else{
            setbranchAdd(false);
          }
          if(newPermission.indexOf("15") > -1){
              setbranchEdit(true);
          }else{
            setbranchEdit(false);
          }
          if(newPermission.indexOf("16") > -1){
              setbranchDelete(true);
          }else{
            setbranchDelete(false);
          }
        
      }   


      useEffect(()=>{
        setTimeout(()=>{
        if(newPermission.indexOf("1") > -1){
          setuserView(true);
        }

        if(newPermission.indexOf("2") > -1){
          setuserAdd(true);
        }
        if(newPermission.indexOf("3") > -1){
          setuserEdit(true);
        }
        if(newPermission.indexOf("4") > -1){
            setuserDelete(true);
        }
        if(newPermission.indexOf("5") > -1){
            setroleView(true);
        }
        if(newPermission.indexOf("6") > -1){
            setroleAdd(true);
        }
        if(newPermission.indexOf("7") > -1){
            setroleEdit(true);
        }
        if(newPermission.indexOf("8") > -1){
            setroleDelete(true);
        }
        if(newPermission.indexOf("9") > -1){
            setclientView(true);
        }
        if(newPermission.indexOf("10") > -1){
            setclientAdd(true);
        }
        if(newPermission.indexOf("11") > -1){
            setclientEdit(true);
        }
        if(newPermission.indexOf("12") > -1){
            setclientDelete(true);
        }
        if(newPermission.indexOf("13") > -1){
            setbranchView(true);
        }
        if(newPermission.indexOf("14") > -1){
            setbranchAdd(true);
        }
        if(newPermission.indexOf("15") > -1){
            setbranchEdit(true);
        }
        if(newPermission.indexOf("16") > -1){
            setbranchDelete(true);
        }
         }, 1000)
      },[newPermission])
     
  return (
    <CRow>
      <CCol lg={12}>
        <CCard>
          <CCardHeader>
            User id: {match.params.id}
          </CCardHeader>
          <CCardBody>
          <CRow>
          <CForm onSubmit={addUser} className="form-horizontal col-md-12">
                    <CCol xs="12" md="12">
                    <CCard>
                        <CCardBody>
                            {submitMessage !== '' &&
                                <CAlert color="secondary">{submitMessage}</CAlert>
                            }
                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel>Role ID</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <p className="form-control-static">{match.params.id}</p>
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            
                            <CCol md="3">
                                <CLabel htmlFor="text-input">Full Name</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input-name" name="text-input" placeholder="Full Name" value={newfullname} onChange={(event) =>{setnewfullname(event.target.value)} } />
                                {NameError && <CFormText>Please Enter Full Name</CFormText>}
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="select">Branch</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CSelect custom name="Branch" id="Branch" value={newBranch} onChange={(event) =>{setnewBranch(event.target.value)}}>
                                <option value="0">Please select Branch</option>
                                {BranchDa.map((e, key) => {   
                                    return <option key={key} value={e.UserID}>{e.FullName}</option>;
                                })}
                                </CSelect>
                            </CCol>
                            </CFormGroup>

                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="select">Client</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CSelect custom name="Client" id="Client" value={newClient} onChange={(event) =>{setnewClient(event.target.value)}}>
                                <option value="0">Please select Client</option>
                                {ClientDa.map((e, key) => {   
                                    return <option key={key} value={e.UserID}>{e.FullName}</option>;
                                })}
                                </CSelect>
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="select">Permissions</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CSelect custom name="Role" id="Role" value={newPermission} onChange={e => handleAddrTypeChange(e)} multiple={true}>
                                <option value="0">Please select Role</option>
                                <option value="1">User View</option>
                                <option value="2">User Add</option>
                                <option value="3">User Edit</option>
                                <option value="4">User Delete</option>
                                <option value="5">Role View</option>
                                <option value="6">Role Add</option>
                                <option value="7">Role Edit</option>
                                <option value="8">Role Delete</option>
                                <option value="9">Client View</option>
                                <option value="10">Client Add</option>
                                <option value="11">Client Edit</option>
                                <option value="12">Client Delete</option>
                                <option value="13">Branch View</option>
                                <option value="14">Branch Add</option>
                                <option value="15">Branch Edit</option>
                                <option value="16">Branch Delete</option>
                                </CSelect>
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                              <CCol md="3">
                                <CLabel>Permissions</CLabel>
                              </CCol>
                              <CCol md="9">
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="user_View" name="user_View" onChange={e => handleAddrTypeChange(e)} value="1" 
                                  checked={userView}
                                  />
                                  
                                  <CLabel variant="custom-checkbox" htmlFor="user_View">User View</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="user_Add" name="user_Add" onChange={e => handleAddrTypeChange(e)} value="2" checked={userAdd}/>
                                  <CLabel variant="custom-checkbox" htmlFor="user_Add">User Add</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="user_Edit" name="user_Edit" onChange={e => handleAddrTypeChange(e)} value="3" checked={userEdit}/>
                                  <CLabel variant="custom-checkbox" htmlFor="user_Edit">User Edit</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="user_Delete" name="user_Delete" onChange={e => handleAddrTypeChange(e)} value="4" checked={userDelete}/>
                                  <CLabel variant="custom-checkbox" htmlFor="user_Delete">User Delete</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="role_View" name="role_View" onChange={e => handleAddrTypeChange(e)} value="5" checked={roleView}/>
                                  <CLabel variant="custom-checkbox" htmlFor="role_View">Role View</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="role_Add" name="role_Add" onChange={e => handleAddrTypeChange(e)} value="6" checked={roleAdd}/>
                                  <CLabel variant="custom-checkbox" htmlFor="role_Add">Role Add</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="role_Edit" name="role_Edit" onChange={e => handleAddrTypeChange(e)} value="7" checked={roleEdit}/>
                                  <CLabel variant="custom-checkbox" htmlFor="role_Edit">Role Edit</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="role_Delete" name="role_Delete" onChange={e => handleAddrTypeChange(e)} value="8" checked={roleDelete}/>
                                  <CLabel variant="custom-checkbox" htmlFor="role_Delete">Role Delete</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="client_View" name="client_View" onChange={e => handleAddrTypeChange(e)} value="9" checked={clientView}/>
                                  <CLabel variant="custom-checkbox" htmlFor="client_View">Client View</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="client_Add" name="client_Add" onChange={e => handleAddrTypeChange(e)} value="10" checked={clientAdd}/>
                                  <CLabel variant="custom-checkbox" htmlFor="client_Add">Client Add</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="client_Edit" name="client_Edit" onChange={e => handleAddrTypeChange(e)} value="11" checked={clientEdit}/>
                                  <CLabel variant="custom-checkbox" htmlFor="client_Edit">Client Edit</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="client_Delete" name="client_Delete" onChange={e => handleAddrTypeChange(e)} value="12" checked={clientDelete}/>
                                  <CLabel variant="custom-checkbox" htmlFor="client_Delete">Client Delete</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="branch_View" name="branch_View" onChange={e => handleAddrTypeChange(e)} value="13" checked={branchView}/>
                                  <CLabel variant="custom-checkbox" htmlFor="branch_View">Branch View</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="branch_Add" name="branch_Add" onChange={e => handleAddrTypeChange(e)} value="14" checked={branchAdd}/>
                                  <CLabel variant="custom-checkbox" htmlFor="branch_Add">Branch Add</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="branch_Edit" name="branch_Edit" onChange={e => handleAddrTypeChange(e)} value="15" checked={branchEdit}/>
                                  <CLabel variant="custom-checkbox" htmlFor="branch_Edit">Branch Edit</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="branch_Delete" name="branch_Delete" onChange={e => handleAddrTypeChange(e)} value="16" checked={branchDelete}/>
                                  <CLabel variant="custom-checkbox" htmlFor="branch_Delete">Branch Delete</CLabel>
                                </CFormGroup>
                              </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="select">Status</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CSelect custom name="Status" id="Status" value={newStatus} onChange={(event) =>{setnewStatus(event.target.value)}}>
                                <option value="">Please Select Status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                                </CSelect>
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            <CButton type="submit" size="sm" color="primary"> Submit</CButton>&nbsp;
                            <CButton onClick={() => history.push(`/roles`)} size="sm" color="danger"> Cancel</CButton>
                            </CFormGroup>
                        </CCardBody>
                    </CCard>
                    </CCol>
                    </CForm>
                 </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Role
