import React from 'react'
import {
  CButton
} from '@coreui/react'
import { useHistory } from 'react-router-dom'
const TheHeaderDropdown = () => {
  const history = useHistory()
  return (
    <CButton
      color="primary"
      variant="outline"
      shape="square"
      size="sm"
      onClick={() => history.goBack()}
      >
          Back 
      </CButton>
  )
}

export default TheHeaderDropdown
