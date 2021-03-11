import React, {Component } from 'react'
  import {
    CCardGroup,
    CWidgetProgressIcon,
    CProgress,
  } from '@coreui/react'
  import {
    CCard,
    CCardBody,
    CCardHeader
  } from '@coreui/react'
  import {
    CChartLine,
    CChartDoughnut
  } from '@coreui/react-chartjs'
  import CIcon from '@coreui/icons-react'

class Dashboard extends Component {

    constructor(props) {
        super(props);
        const user_detail = localStorage.getItem("userDetail");
        if(user_detail !== null){
            const user_parse_data = JSON.parse(user_detail);
            const isVerify = user_parse_data.isVerify;
    
            if(isVerify === '0'){
                window.open('#/loginVeriy',"_self");
            }
        }else{
            window.open('#/login',"_self");
        }
    }

    
    render(){
        return (
            <>
            <CCardGroup className="mb-4">
                <CWidgetProgressIcon
                header="87.500"
                text="Visitors"
                color="gradient-info"
                >
                <CIcon name="cil-people" height="36"/>
                </CWidgetProgressIcon>
                <CWidgetProgressIcon
                header="385"
                text="New Clients"
                color="gradient-success"
                >
                <CIcon name="cil-userFollow" height="36"/>
                </CWidgetProgressIcon>
                <CWidgetProgressIcon
                header="1238"
                text="Products sold"
                color="gradient-warning"
                >
                <CIcon name="cil-basket" height="36"/>
                </CWidgetProgressIcon>
                <CWidgetProgressIcon
                header="28%"
                text="Returning Visitors"
                >
                <CIcon name="cil-chartPie" height="36"/>
                </CWidgetProgressIcon>
                <CWidgetProgressIcon
                header="5:34:11"
                text="Avg. Time"
                color="gradient-danger"
                progressSlot={
                    <CProgress color="danger" size="xs" value={75} animated className="my-3"
                />}
                >
                <CIcon name="cil-speedometer" height="36"/>
                </CWidgetProgressIcon>
            </CCardGroup>
            <CCardGroup columns className = "cols-2" >    
            <CCard>
                <CCardHeader>
                Doughnut Chart
                </CCardHeader>
                <CCardBody>
                <CChartDoughnut
                    datasets={[
                    {
                        backgroundColor: [
                        '#41B883',
                        '#E46651',
                        '#00D8FF',
                        '#DD1B16'
                        ],
                        data: [40, 20, 80, 10]
                    }
                    ]}
                // labels={['VueJs', 'EmberJs', 'ReactJs', 'AngularJs']}
                    options={{
                    tooltips: {
                        enabled: true
                    }
                    }}
                />
                </CCardBody>
            </CCard>
            <CCard>
        <CCardHeader>
          Line Chart
        </CCardHeader>
        <CCardBody>
          <CChartLine
            datasets={[
              {
                label: '',
                backgroundColor: 'rgb(228,102,81,0.9)',
                data: [30, 39]
              },
              {
                label: '',
                backgroundColor: 'rgb(0,216,255,0.9)',
                data: [39, 80]
              }
            ]}
            options={{
              tooltips: {
                enabled: true
              }
            }}
            labels="months"
          />
        </CCardBody>
      </CCard>
      </CCardGroup>
            </>
        )
    }
}

export default Dashboard
