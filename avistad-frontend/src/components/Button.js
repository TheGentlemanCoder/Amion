import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const MyButton = styled.button`
    background-color: black;
    color: white;
    font-size: 20px;
    padding: 10px 60px;
    border-radius: 5px;
    margin: 10px 0px;
    cursor: pointer;
    position: relative;
    align-items: center;
    justify-content: center;
    padding: 20px;
    text-align: center;
`;

const Button = ({ text, onClick }) => (
    <MyButton onClick={onClick}>
        {text}
    </MyButton>
);

Button.defaultProps = {
    onClick: null
};

Button.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

export default Button;