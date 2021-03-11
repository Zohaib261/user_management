import React, { useState, useEffect,useCallback  } from 'react'
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

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

var permissions = localStorage.getItem("userPermission");
var splitPermissions = permissions.split(',');

const Clients = () => {
  const history = useHistory()
  const [modal, setModal] = useState(false)
  const [userDa, setUserDa] = useState([])
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [newfullname, setnewfullname] = useState('')
  const [newStatus, setnewStatus] = useState('')
  const [NameError, setNameError] = useState(false)
  const [submitMessage, setsubmitMessage] = useState("")
  const [addButton, setaddButton] = useState(false)
  const [editButton, seteditButton] = useState(false)
  const [deleteButton, setdeleteButton] = useState(false)


  const addUser = useCallback((event) =>{
        event.preventDefault();

        if(newfullname === ''){
            setNameError(true);
            return false;
        }else{
            setNameError(false);
        }

       

        axios.post(`${api_url}api.php?type=addClient`, {
            "name":newfullname,
            "status":newStatus
        },{
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
        }
        ).then((response) => { 
            const user_response = response.data;
            setsubmitMessage(user_response.message);
            if(user_response.type === "success"){
                //getClientData();
                resetForm();
            }
           
        }).catch(err => {
            console.log('Error: ', err);
        })
  })
 
  const deleteUser = useCallback((id) =>{
    axios.get(`${api_url}api.php?type=deleteClient&id=`+id)
    .then((response) => { 
        console.log(response.data);
    }).catch(err => {
        console.log('Error: ', err);
    })
  },[])

  useEffect(()=>{
    if(splitPermissions.indexOf("10") > -1){
      setaddButton(true);
    }
    if(splitPermissions.indexOf("11") > -1){
      seteditButton(true);
    }
    if(splitPermissions.indexOf("12") > -1){
      setdeleteButton(true);
    }
  },[])

  useEffect(()=>{
    getClientData();
    },[addUser,deleteUser])


    const getClientData = () => {
        axios.get(`${api_url}api.php?type=clientData`)
        .then((response) => { 
            const userddData = response.data;
            setUserDa(userddData);
        }).catch(err => {
            console.log('Error: ', err);
        })
    }

  const resetForm = () => {
      setnewfullname("");
      setnewStatus("");
  }

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/users?page=${newPage}`)
  }

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page])

  
 
  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            Users
            {addButton ?
            <CButton 
              onClick={() => setModal(!modal)} 
              className="btn btn-primary float-right"
            >Add New Client</CButton>
            : null
            }
            <CModal 
              show={modal} 
              onClose={setModal}
            >
              
                <CForm onSubmit={addUser} className="form-horizontal">
              <CModalHeader closeButton>
                <CModalTitle>Add Client</CModalTitle>
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
                                <CLabel htmlFor="text-input">Client Name</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input-name" name="text-input" placeholder="Full Name" value={newfullname} onChange={(event) =>{setnewfullname(event.target.value)} } />
                                {NameError && <CFormText>Please Enter Full Name</CFormText>}
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
              'CreatedAt','UserActive','Actions'
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
                        onClick={() => history.push(`/client/${item.UserID}`)}
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
                        onClick={() => history.push(`/editClient/${item.UserID}`)}
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

export default Clients
