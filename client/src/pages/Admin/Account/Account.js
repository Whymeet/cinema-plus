import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { AccountProfile, AccountDetails } from './components';
import { uploadImage } from '../../../store/actions';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  }
});

class Account extends Component {
  state = { 
    image: null,
    imagePreview: null
  };

  handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      this.setState({ 
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
      
      // Сразу загружаем фото при выборе
      if (this.props.user && this.props.user._id) {
        try {
          await this.props.uploadImage(this.props.user._id, file);
          // После успешной загрузки очищаем состояние
          this.setState({
            image: null
          });
        } catch (error) {
          console.error('Ошибка при загрузке фото:', error);
        }
      }
    }
  };

  componentWillUnmount() {
    // Очищаем URL превью при размонтировании компонента
    if (this.state.imagePreview) {
      URL.revokeObjectURL(this.state.imagePreview);
    }
  }

  render() {
    const { image, imagePreview } = this.state;
    const { classes, user } = this.props;
    
    if (!user) {
      return <div>Загрузка...</div>;
    }
    
    return (
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item lg={4} md={6} xl={4} xs={12}>
            <AccountProfile
              file={image}
              imagePreview={imagePreview}
              user={user}
              onUpload={this.handleImageUpload}
            />
          </Grid>
          <Grid item lg={8} md={6} xl={8} xs={12}>
            <AccountDetails
              user={user}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

Account.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  uploadImage: PropTypes.func.isRequired
};

const mapStateToProps = ({ authState }) => ({
  user: authState.user
});

export default connect(mapStateToProps, { uploadImage })(
  withStyles(styles)(Account)
);
