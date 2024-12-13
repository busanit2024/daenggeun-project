import styled from "styled-components";

const RadioWrapper = styled.label`
  position: relative;
  display: inline-block;
  width: ${props => props.big ? "24px" : "18px"};
  height: ${props => props.big ? "24px" : "18px"};

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    border-radius: 50%;
  }

  :not(input:checked) + :hover .checkmark {
    background-color: #ccc;
  }


  input:checked + .checkmark:after {
    position: absolute;
    content: "";
    height: ${props => props.big ? "12px" : "8px"};
    width: ${props => props.big ? "12px" : "8px"};
    left: ${props => props.big ? "6px" : "5px"};
    top: ${props => props.big ? "6px" : "5px"};
    background-color: white;
    border-radius: 50%;
  }

  :not(input:checked) + .checkmark {
    border: 1px solid #ccc;
  }

  :not(input:checked) + .checkmark:after {
    display: none;
  }

  input:checked + .checkmark {
    background-color: #FF7B07;
  }

  input:focus + .checkmark {
    box-shadow: 0 0 1px #c2c2c2;
  }

  input:not(:checked):hover + .checkmark {
    background-color: #f0f0f0;
  }
`;


export default function Radio(props) {
  const { value, name, id, checked, defaultChecked, onChange, big } = props;
    return (
        <RadioWrapper big={big}>
            <input type="radio" name={name} id={id} value={value} defaultChecked={defaultChecked} checked={checked} onChange={onChange} />
            <span className="checkmark"></span>
        </RadioWrapper>
    );
}