import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import API from "../utils/API";
import Admin from './admin/AdminDashboard';
import Instructor from './instructor/InstructorDashboard';
import Student from './student/StudentDashboard';

 class Dashboard extends Component{

    constructor(props){
        super(props);
    this.state = {
        role:'',
        token: sessionStorage.getItem('token')
      }
    }

     async getData(){

      sessionStorage.setItem('pageSizeCourse', 5)
      sessionStorage.setItem('pageSizeCodewordset', 5)
        console.log('getdata')
        const headers = {
            'Content-Type': 'application/json',
            'token':  this.state.token
          };
         
        console.log(headers)
         try {
            const response = await API.get('dashboard/details', {headers});
            console.log('👉 Returned data in :', response);
            console.log(response.data)
            if(response.status == 200){
            this.setState( {
              id: response.data.email_id,   
              role: response.data.role,
              name: response.data.first_name + ' ' + response.data.last_name
            })
            
            console.log('dashbaord : '+ this.state.role)
            
        }else {
        
        }
          } catch (e) {
            console.log(`😱 Axios request failed: ${e}`);
          }
      //  }
    
    }

    componentDidMount(){
        this.getData()
    }
    render(){
        const { match, location, history } = this.props;
    return(
        <div>
         
            {this.state.role == 'admin'?
            <Admin></Admin>:
            this.state.role == 'instructor'?
            <Instructor></Instructor>:this.state.role == 'student'?
            <Student></Student>:false}
        </div>
    );
    }
}
export default withRouter(Dashboard);