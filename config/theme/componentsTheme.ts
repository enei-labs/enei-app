import { createTheme } from "@mui/material/styles";
import paletteTheme from "./paletteTheme";

const { palette } = paletteTheme as any;

const breakpoints = createTheme().breakpoints;

const componentsTheme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "none",
          boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.15)",
          borderRadius: "16px",
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { size: "medium" },
          style: {
            height: '48px',
            padding: "0 12px",
          },
        },
        {
          props: { size: "medium" },
          style: {
            height: '40px',
            padding: "0 12px",
          },
        },
        {
          props: { size: "small" },
          style: {
            height: '28px',
            padding: "0 8px",
          },
        },
        {
          props: { variant: "outlined" },
          style: {
            color: palette.text.primary,
            "& svg": {
              color: palette.primary.main
            }
          }
        }
      ],
      styleOverrides: {
        startIcon: {
          "& svg": {
            color: '#FFF'
          }
        },
        root: {
          boxShadow: "none",
          border: `1px solid ${palette.secondary.main}`,
          color: "#FFF",
          "&.MuiButton-text": {
            width: "fit-content",
            minHeight: "fit-content",
            backgroundColor: palette.primary.dark,
            color: "#FFF",
          },
          "&.MuiButton-text:hover": {
            backgroundColor: "#004D40",
          },
          "&.MuiButton-containedPrimary": {
            color: "white",
          },
          "&.MuiButton-outlinedSecondary": {
            border: `1px solid ${palette.secondary.main}`,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          height: "64px",
          backgroundColor: "#FFF",
          boxShadow: "none",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        }
      }
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            cursor: "not-allowed",
            pointerEvents: "auto",
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: "16px",
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            fieldset: {
              background: "#F5F5F5",
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: "16px",
          ".Mui-disabled": {
            /** 讓 fieldSet 的背景色不會蓋住字 */
            zIndex: 10,
            cursor: "not-allowed",
          },
          "& input::placeholder": {
            fontSize: "16px",
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          fontSize: "16px"
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiDialog-paper': {
            borderRadius: "16px",
          }
        },
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "36px",
          textAlign: "center",
          [breakpoints.down("md")]: {
            padding: "30px",
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          "& .MuiTablePagination-selectLabel": {
            fontSize: "14px",
          },
          "& .MuiTablePagination-displayedRows": {
            fontSize: "14px",
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: palette.text.secondary,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
  },
});

export default componentsTheme;
