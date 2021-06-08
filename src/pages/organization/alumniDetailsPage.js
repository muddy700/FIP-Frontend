import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { fetchAllRatings, fetchAlumniCertificates, fetchAlumniSkills, fetchCvEducationInfo, fetchCvExperienceInfo, fetchCvPersonalInfo, getAlumniProfile, } from '../../app/api'
import { selectUserData, saveUser, apiConfigurations } from '../../slices/userSlice'
import { useSelector, useDispatch}  from 'react-redux'

const AlumniDetailsPage = () => {
    
    const param = useParams()
    const alumniId = param.id
    const config = useSelector(apiConfigurations)

    const [alumniProfile, setAlumniProfile] = useState({})
    const [alumniPersonaInfo, setAlumniPersonaInfo] = useState({})
    const [alumniEducationInfo, setAlumniEducationInfo] = useState([])
    const [alumniExperienceInfo, setAlumniExperienceInfo] = useState([])
    const [alumniCertificates, setAlumniCertificates] = useState([])
    const [alumniSkills, setAlumniSkills] = useState([])
    const [alumniRatings, setAlumniRatings] = useState([])

    const getProfile = async () => {
        try {
            const profile = await getAlumniProfile(alumniId, config)
            setAlumniProfile(profile[0])
        } catch (error) {
            console.log({
                'Request': 'Get Published Alumni Profile Request',
                'Error => ' : error.response.data,
            })
        }
    }

    const getPersonalInfo = async () => {
        try {
            const response = await fetchCvPersonalInfo(alumniId, config)
            setAlumniPersonaInfo(response[0])
        } catch (error) {
            console.log({
                'Request': 'Get Published Alumni Personal Info Request',
                'Error => ' : error.response.data,
            })
        }
    }

    const getEducationInfo = async () => {
        try {
            const response = await fetchCvEducationInfo(alumniId, config)
            setAlumniEducationInfo(response)
        } catch (error) {
            console.log('Get Published Alumni Education Info ', error.response.data)
        }
    }

    const getExperienceInfo = async () => {
        try {
            const response = await fetchCvExperienceInfo(alumniId, config)
            setAlumniExperienceInfo(response)
        } catch (error) {
            console.log('Get Published Alumni Experience Info ', error.response.data)
        }
    }

    const getCertificates = async () => {
        try {
            const response = await fetchAlumniCertificates(alumniId, config)
            setAlumniCertificates(response)
        } catch (error) {
            console.log('Get Published Alumni Certificates ', error.response.data)
        }
    }

    const getSkills = async () => {
        try {
            const response = await fetchAlumniSkills(alumniId, config)
            setAlumniSkills(response)
        } catch (error) {
            console.log('Get Published Alumni skills ', error.response.data)
        }
    }

    const getRatings = async () => {
        try {
            const response = await fetchAllRatings(config)
            const alumni_ratings = response.filter(item => item.alumni === parseInt(alumniId))
            setAlumniRatings(alumni_ratings)
        } catch (error) {
            console.log('Get Published Alumni Ratings ', error.response.data)
        }
    }

    useEffect(() => {
        getProfile();
        getPersonalInfo();
        getEducationInfo();
        getExperienceInfo();
        getCertificates();
        getSkills();
        getRatings();

    }, [])

    return (
        <div>
            <h1>Alumni Info {alumniId}</h1>
        </div>
    )
}

export default AlumniDetailsPage
