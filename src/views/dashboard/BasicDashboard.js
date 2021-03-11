import React,{useState} from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupAppend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import BackgroundSlider from 'react-background-slider'
import image1 from '../../slider/1.jpg'
import image2 from '../../slider/2.jpg'
import image3 from '../../slider/3.jpg'
import image4 from '../../slider/4.jpg'
import image5 from '../../slider/5.jpg'
import image6 from '../../slider/6.jpg'

const items = [
  {
    id: '#/users',
    name: 'User View'
  },
  {
    id: '#/users',
    name: 'User Add'
  },
  {
    id: '#/users',
    name: 'User Edit'
  },
  {
    id: '#/users',
    name: 'User Delete'
  },
  {
    id: '#/roles',
    name: 'Role View'
  },
  {
    id: '#/roles',
    name: 'Role Add'
  },
  {
    id: '#/roles',
    name: 'Role Edit'
  },
  {
    id: '#/roles',
    name: 'Role Delete'
  },
 {
    id: '#/branches',
    name: 'Branches View'
  },
  {
    id: '#/branches',
    name: 'Branches Add'
  },
  {
    id: '#/branches',
    name: 'Branches Edit'
  },
  {
    id: '#/branches',
    name: 'Branches Delete'
  },
  {
    id: '#/clients',
    name: 'Clients View'
  },
  {
    id: '#/clients',
    name: 'Clients Add'
  },
  {
    id: '#/clients',
    name: 'Clients Edit'
  },
  {
    id: '#/clients',
    name: 'Clients Delete'
  },
  {
    id: '#/users',
    name: 'Role View'
  }

]

const Page404 = () => {

  const redirect = (value) =>{
    window.open(value,"_self");
  }

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(string, results)
  }

  const handleOnSelect = (item) => {
    // the item selected
    //console.log(item);
    redirect(item.id);
  }


  return (
    <div className=" c-default-layout flex-row align-items-center">
      <BackgroundSlider
  images={[image1, image2,image3, image4,image5, image6]}
  duration={10} transition={2} />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="12">
            <div className="clearfix">
              <h3 className="text-center display-4 mr-4">ADMS MAIN PAGE</h3>
              
            </div>
            <div className="clearfix text-center">
              <CButton color="primary">Inter User Message(s)</CButton>&nbsp;
              <CButton color="primary">Favorites</CButton>&nbsp;
              <CButton color="primary" onClick={()=>{window.open("#/dashbaord","_self")}}>Manage Dashboard</CButton>&nbsp;
              <CButton color="primary">Marketing</CButton>&nbsp;
              <CButton color="primary">Manage Sale</CButton>&nbsp;
              <CButton color="primary">Rent Lease Borrow</CButton>&nbsp;
              <br /> <br />
              
            </div>
            <div>
            <div style={{ width: 1100 }}>
          <ReactSearchAutocomplete
            items={items}
            onSelect={handleOnSelect}
            placeholder="What are you looking for?"
          />
        </div>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page404
