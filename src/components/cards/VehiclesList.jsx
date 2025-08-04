import React, { useEffect } from 'react'

import { api } from '../../config/api.config';

const VehiclesList = () => {
    useEffect(() => {
        api.get('/vehicles')
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);
  return (
    <div>VehiclesList</div>
  )
}

export default VehiclesList