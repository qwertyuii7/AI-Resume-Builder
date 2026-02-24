import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import api from '../configs/api';

const PublicResumeImport = () => {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const cloneAndOpen = async () => {
            if (!token) {
                navigate(`/login?redirect=${encodeURIComponent(`/app/public/${resumeId}/use`)}`, { replace: true });
                return;
            }

            try {
                const { data } = await api.post(`/api/resumes/public/${resumeId}/clone`, {}, {
                    headers: { Authorization: token }
                });

                if (data?.resume?._id) {
                    navigate(`/app/builder/${data.resume._id}`, { replace: true });
                    return;
                }

                toast.error('Unable to copy this resume right now.');
                navigate('/', { replace: true });
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Failed to import resume');
                navigate('/', { replace: true });
            }
        };

        cloneAndOpen();
    }, [resumeId, token, navigate]);

    return <Loader />;
};

export default PublicResumeImport;
