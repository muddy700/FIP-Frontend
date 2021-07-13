import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import Icon from 'supercons'
import '../../styles/sidebar.css'
import { useSelector}  from 'react-redux'
import { MdAnnouncement, MdPerson, MdSettings } from "react-icons/md";
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import { getStudentProfileInfo } from '../../app/api';

const StudentSidebar = () => {

    const config = useSelector(apiConfigurations)
    const user = useSelector(selectUserData)

    const [studentInfo, setStudentInfo] = useState({})

    
    const getStudentProfile = async () => {
        // setIsFetchingData(true)
        try {
            const response = await getStudentProfileInfo(user.userId, config)
            setStudentInfo(response[0])
            // setIsFetchingData(false)
        } catch (error) {
            console.log('Getting Student Profile Info ', error.response.data)
        }
    }

    
    useEffect(() => {
        getStudentProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ul className="list-wrapper">
            <li className="list-item">
                <Link to = "dashboard" className="aside-link">
                     <Icon glyph="grid" size={32} /> <span>Dashboard</span>
                </Link>
            </li>
            <li className="list-item" hidden={studentInfo.has_reported}>
                <Link to = "/available_posts" className="aside-link">
                     <Icon glyph="docs" size={32} /> <span>Available Posts</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/logbook" className="aside-link">
                     <Icon glyph="post" size={32} /> <span>Log Book</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/field_info" className="aside-link">
                     <MdAnnouncement style={{fontSize: '20px'}}/> <span>Field Info</span>
                </Link>
            </li>
            <li className="inner-list-item">
                <Link to = "/my_profile" className="aside-link">
                    <MdPerson style={{fontSize: '20px'}}/> <span>My Profile</span>
                </Link>
            </li>
            {/* <li className="inner-list-item">
                <Link to = "/my_projects" className="aside-link">
                    <Icon glyph="docs-fill" size={24} /> <span>My Projects</span>
                </Link>
            </li> */}
            <li className="list-item">
                <Link to = "/password" className="aside-link">
                     <MdSettings style={{fontSize: '20px'}}/> <span>Change Password</span>
                </Link>
            </li>
        </ul>
    )
}

export default StudentSidebar
