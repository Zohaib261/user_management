import React from 'react'
import CIcon from '@coreui/icons-react'
var permissions = localStorage.getItem("userPermission");
if(permissions !== null){
  var splitPermissions = permissions.split(',');
}else{
  var splitPermissions = [];
}


var _nav =  [{
  _tag: 'CSidebarNavItem',
  name: 'Dashboard',
  to: '/dashboard',
  icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>
}];
  if(splitPermissions.indexOf("1") > -1){
     _nav.push( {
      _tag: 'CSidebarNavItem',
      name: 'Users',
      to: '/users',
      icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>
    })
  }

  if(splitPermissions.indexOf("5") > -1){
    _nav.push( {
      _tag: 'CSidebarNavItem',
      name: 'Roles',
      to: '/roles',
      icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>
    })
 }

 if(splitPermissions.indexOf("9") > -1){
  _nav.push({
    _tag: 'CSidebarNavItem',
    name: 'Clients',
    to: '/clients',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>
  })
}
 if(splitPermissions.indexOf("13") > -1){
  _nav.push({
    _tag: 'CSidebarNavItem',
    name: 'Branches',
    to: '/branches',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>
  })
}


  _nav.push(
  {
    _tag: 'CSidebarNavItem',
    name: 'Logout',
    to: '/logout',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
    label: true
  })

export default _nav
