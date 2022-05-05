import React from 'react'

export const navigationRef = React.createRef<any>();

const navigate = (name :string, params: any) => {
    navigationRef.current?.navigate(name, params);
}

export default {navigate}