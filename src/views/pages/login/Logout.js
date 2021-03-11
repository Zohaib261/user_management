const Logout = () => {
    localStorage.removeItem("userDetail");
    localStorage.removeItem("userPermission");
    window.open('#/login',"_self");
    return null;
}

export default Logout;
