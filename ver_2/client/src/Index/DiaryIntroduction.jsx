import React from "react";
import styled from "styled-components";

const Title = styled.h1`
  margin-top: 30px;
  margin-bottom: 10px;
  font-size: 42px;
  font-family: AbeeZee;
`;

const Description = styled.p`
  max-width: 100%;
  margin-bottom: 10px;
  text-align: center;
  font-size: 20px;
  font-family: AbeeZee;
`;

const DiaryIntroduction = ({title, description}) => {
    return (
        <>
          <Title >{title}</Title>
          <Description>
              {description}
          </Description>
        </>
    );
};

export default DiaryIntroduction;