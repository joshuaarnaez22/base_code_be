import { ComponentStyleConfig } from '@chakra-ui/react';
const Button: ComponentStyleConfig = {
    baseStyle: {},
    sizes: {},
    variants: {
        normal: {
            bg: 'red200',
            _hover: {
                transform: 'scale(1.05)',
                transition: 'all 0.2s linear',
                bg: 'red300',
            },
        },
    },
    defaultProps: {},
};

const Textarea: ComponentStyleConfig = {
    baseStyle: {},
    sizes: {},
    variants: {
        normal: {
            border: '1px solid',
            borderColor: 'gray300',
            _hover: {
                borderColor: 'gray400',
            },
            _focus: {
                borderColor: 'gray500',
            },
            _placeholder: {
                opacity: 0.5,
            },
        },
    },
    defaultProps: {},
};

const Input: ComponentStyleConfig = {
    baseStyle: {},
    sizes: {},
    variants: {
        normal: {
            field: {
                border: '1px solid',
                borderColor: 'gray300',
                _hover: {
                    borderColor: 'gray400',
                },
                _focus: {
                    borderColor: 'red',
                },
                _placeholder: {
                    opacity: 0.5,
                },
            },
        },
        basic: {
            field: {
                color: 'white',
                bg: 'black300',
                fontFamily: 'lexendDeca',
                borderRadius: '10px',
                h: '45px',
            },
        },
    },
    defaultProps: {},
};

const components = {
    Button,
    Textarea,
    Input,
};
export default components;
