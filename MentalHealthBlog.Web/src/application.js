export const application = {
  // application_url: 'https://localhost:7029/api',
  application_url: 'http://localhost:5150/api',
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
  add_post_modal_style: {
    overlay: {
      overflowY: 'scroll',
      background: '#82a3bc60',
    },
    content: {
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
      padding: '0rem 2rem 1rem 2rem',
    },
  },
  layouts: {
    min_screen_single_col_width: 680,
  },
}
