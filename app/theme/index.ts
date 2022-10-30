import { extendTheme } from '@chakra-ui/react';
import { colors } from './colors';
import { breakpoints } from './breakpoints';
import { fonts, fontWeights, fontSizes } from './fonts';
import comps from './components';
export const theme = extendTheme({
    colors,
    breakpoints,
    fonts,
    fontWeights,
    fontSizes,
    components: {
        ...comps,
    },
});
