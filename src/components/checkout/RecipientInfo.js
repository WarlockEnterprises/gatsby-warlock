import React from "react"

const RecipientInfo = ({
  firstName,
  lastName,
  address1,
  address2,
  city,
  state_code,
  country_code,
  zip,
  email,
}) => (
  <>
    <div>{firstName + " " + lastName}</div>
    <div>{address1}</div>
    <div>{address2}</div>
    <div>{[city, state_code].join(", ")}</div>
    <div>{country_code}</div>
    <div>{zip}</div>
    <div>{email}</div>
  </>
)

export default RecipientInfo
