import React, { useState, useEffect,useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import {
  CButton,
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormGroup,
  CFormText,
  CInput,
  CLabel,
  CSelect,
  CAlert
} from '@coreui/react'
import axios from "axios";
import * as myConstClass from '../../constants';
const api_url = myConstClass.api_url;

var permissions = localStorage.getItem("userPermission");
var splitPermissions = permissions.split(',');


const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

const Branches = () => {
  const history = useHistory()
  const [modal, setModal] = useState(false)
  const [userDa, setUserDa] = useState([])
  const [ClientDa, setClientDa] = useState([])
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [newfullname, setnewfullname] = useState('')
  const [newClient, setnewClient] = useState('')
  const [newState, setnewState] = useState('')
  const [newAddress1, setnewAddress1] = useState('')
  const [newAddress2, setnewAddress2] = useState('')
  const [newZip, setnewZip] = useState('')
  const [newCountry, setnewCountry] = useState('')
  const [newContact, setnewContact] = useState('')
  const [newStatus, setnewStatus] = useState('')
  const [NameError, setNameError] = useState(false)
  const [submitMessage, setsubmitMessage] = useState("")
  const [addButton, setaddButton] = useState(false)
  const [editButton, seteditButton] = useState(false)
  const [deleteButton, setdeleteButton] = useState(false)


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
      if(splitPermissions.indexOf("14") > -1){
        setaddButton(true);
      }
      if(splitPermissions.indexOf("15") > -1){
        seteditButton(true);
      }
      if(splitPermissions.indexOf("16") > -1){
        setdeleteButton(true);
      }
    },[])

  const addUser = useCallback((event) =>{
        event.preventDefault();

        if(newfullname === ''){
            setNameError(true);
            return false;
        }else{
            setNameError(false);
        }

        axios.post(`${api_url}api.php?type=addBranch`, {
            "name":newfullname,
            "client":newClient,
            "state":newState,
            "address1":newAddress1,
            "address2":newAddress2,
            "zip":newZip,
            "country":newCountry,
            "contact":newContact,
            "status":newStatus
        },{
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
        }
        ).then((response) => { 
            const user_response = response.data;
            console.log(user_response);
            setsubmitMessage(user_response.message);
            if(user_response.type === "success"){
                resetForm();
            }
           
        }).catch(err => {
            console.log('Error: ', err);
        })
  })


  const resetForm = () => {
      setnewfullname("");
      setnewClient("");
      setnewStatus("");
  }

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/branches?page=${newPage}`)
  }

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page])

  const deleteUser = useCallback((id) =>{
    axios.get(`${api_url}api.php?type=deleteBranch&id=`+id)
    .then((response) => { 
        console.log(response.data);
    }).catch(err => {
        console.log('Error: ', err);
    })
  })

  useEffect(()=>{
    axios.get(`${api_url}api.php?type=branchData`)
    .then((response) => { 
        const userddData = response.data;
        setUserDa(userddData);
    }).catch(err => {
        console.log('Error: ', err);
    })
},[addUser,deleteUser])
 
  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            Branches
            {addButton ?
            <CButton 
              onClick={() => setModal(!modal)} 
              className="btn btn-primary float-right"
            >Add New Branch</CButton>
            : null
            }
            <CModal 
              show={modal} 
              onClose={setModal}
            >
                <CForm onSubmit={addUser} className="form-horizontal">
              <CModalHeader closeButton>
                <CModalTitle>Add Branch</CModalTitle>
              </CModalHeader>
              <CModalBody>
                 <CRow>
                    <CCol xs="12" md="12">
                    <CCard>
                        <CCardBody>
                            {submitMessage !== '' &&
                                <CAlert color="secondary">{submitMessage}</CAlert>
                            }
                            
                            
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
                                <CLabel htmlFor="text-input">Branch Name</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input-name" name="text-input" placeholder="Branch Name" value={newfullname} onChange={(event) =>{setnewfullname(event.target.value)} } />
                                {NameError && <CFormText>Please Enter Branch Name</CFormText>}
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="text-input">Address Line 1</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input-name" name="text-input" placeholder="Address Line 1" value={newAddress1} onChange={(event) =>{setnewAddress1(event.target.value)} } />
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            
                            <CCol md="3">
                                <CLabel htmlFor="text-input">Address Line 2</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input-name" name="text-input" placeholder="Address Line 2" value={newAddress2} onChange={(event) =>{setnewAddress2(event.target.value)} } />
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            
                            <CCol md="3">
                                <CLabel htmlFor="text-input">State/Province</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input-name" name="text-input" placeholder="State/Province" value={newState} onChange={(event) =>{setnewState(event.target.value)} } />
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            
                            <CCol md="3">
                                <CLabel htmlFor="text-input">Zip/Postal code</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input-name" name="text-input" placeholder="Zip/Postal code" value={newZip} onChange={(event) =>{setnewZip(event.target.value)} } />
                                {NameError && <CFormText>Please Enter Branch Name</CFormText>}
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            
                            <CCol md="3">
                                <CLabel htmlFor="text-input">Country</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input-name" name="text-input" placeholder="Country" value={newCountry} onChange={(event) =>{setnewCountry(event.target.value)} } />
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="text-input">Contact Number</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input-name" name="text-input" placeholder="Contact Number" value={newContact} onChange={(event) =>{setnewContact(event.target.value)} } />
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
                           
                        
                        </CCardBody>
                
                    </CCard>
                    
                    </CCol>
                 </CRow>   
              </CModalBody>
              <CModalFooter>
              <CButton type="submit" size="sm" color="primary"> Submit</CButton>
                <CButton onClick={resetForm} size="sm" color="danger"> Reset</CButton>
                <CButton 
                  color="secondary" 
                  size="sm"
                  onClick={() => setModal(false)}
                >Cancel</CButton>
              </CModalFooter>
              </CForm>
            </CModal>
          </CCardHeader>
          <CCardBody>
          <CDataTable
            items={userDa}
            fields={[
              { key: 'FullName', _classes: 'font-weight-bold' },
              'ClientID','CreatedAt', 'UserActive','Actions'
            ]}
            hover
            striped
            itemsPerPage={10}
            activePage={page}
            scopedSlots = {{
              'status':
                (item)=>(
                  <td>
                    <CBadge color={getBadge(item.UserActive)}>
                      {item.status}
                    </CBadge>
                  </td>
                  
                ),
            'Actions':
                (item)=>{
                    return (
                    <td className="py-2">
                        <CButton
                        color="warning"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => history.push(`/branch/${item.UserID}`)}
                        >
                            View 
                        </CButton>
                        &nbsp;
                        {editButton ?
                        <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => history.push(`/editBranch/${item.UserID}`)}
                        >
                            Edit 
                        </CButton>
                        :null 
                      }
                        &nbsp;
                        {deleteButton ?
                        <CButton
                        color="danger"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() =>{deleteUser(item.UserID)}}
                        >
                            Delete
                        </CButton>
                        : null
                      }
                    </td>
                    )}
            }}
          />
          <CPagination
            activePage={page}
            onActivePageChange={pageChange}
            pages={5}
            doubleArrows={false} 
            align="center"
          />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Branches
