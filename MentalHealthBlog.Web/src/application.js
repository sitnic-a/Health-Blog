// const APPLICATION_ENDPOINT = process.env.REACT_APP_APPLICATION_ENDPOINT
const APPLICATION_URL = process.env.REACT_APP_APPLICATION_URL
export const application = {
  application_url: 'https://localhost:7029/api',
  // application_url: `http://${APPLICATION_ENDPOINT}`,
  // application_url: `${APPLICATION_URL}`,
  modal_style: {
    overlay: {
      background: '#82a3bc60',
    },
    content: {
      background: '#f0eae1',
      borderRadius: '0.7rem',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      maxWidth: '700px',
      height: '150px',
      width: '80%',
      padding: '2rem',
    },
  },

  trial_period_style: {
    overlay: {
      background: '#82a3bc98',
    },
    content: {
      background: '#f0eae1',
      borderRadius: '0.7rem',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      maxWidth: '450px',
      height: '350px',
      width: '80%',
      padding: '2rem',
      scrollbarWidth: '0',
    },
  },

  add_post_modal_style: {
    overlay: {
      overflowY: 'scroll',
      background: '#82a3bc60',
    },
    content: {
      zIndex: 2,
      background: '#f3f1e3',
      borderRadius: '0.7rem',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      maxWidth: '700px',
      maxHeight: '500px',
      width: '80%',
      paddingInline: '1.5rem',
    },
  },
  assignments_modal_style: {
    overlay: {
      background: '#82a3bc60',
    },
    content: {
      background: '#f0eae1',
      borderRadius: '0.7rem',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      maxWidth: '700px',
      height: '400px',
      width: '80%',
      padding: '2rem',
      scrollbarWidth: 'none',
    },
    matchMedia: {
      'width<550px': {
        marginInline: '2rem',
      },
    },
  },
  layouts: {
    min_screen_single_col_width: 680,
  },
}
