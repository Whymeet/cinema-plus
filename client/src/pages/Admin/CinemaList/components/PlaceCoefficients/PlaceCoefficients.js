import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import styles from './styles';
import { getPlaces } from '../../../../../store/actions/places';

class PlaceCoefficients extends Component {
  state = {
    coefficients: []
  };

  componentDidMount() {
    this.loadCoefficients();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open !== this.props.open && this.props.open) {
      this.loadCoefficients();
    }
  }

  loadCoefficients = async () => {
    const { cinema } = this.props;
    if (cinema && cinema._id) {
      const places = await this.props.getPlaces(cinema._id);
      if (places && places.length > 0) {
        // Преобразуем массив мест в матрицу коэффициентов
        const maxRow = Math.max(...places.map(p => p.row));
        const maxSeat = Math.max(...places.map(p => p.seat));
        const coefficients = Array(maxRow + 1)
          .fill()
          .map(() => Array(maxSeat + 1).fill({ coefficient: 1.0 }));

        places.forEach(place => {
          coefficients[place.row][place.seat] = {
            coefficient: place.priceCoefficient
          };
        });

        this.setState({ coefficients });
      } else {
        // Если мест нет, создаем пустую матрицу
        const coefficients = cinema.seats.map((row, rowIndex) =>
          row.map((seat, seatIndex) => ({
            row: rowIndex,
            seat: seatIndex,
            coefficient: 1.0
          }))
        );
        this.setState({ coefficients });
      }
    }
  };

  handleCoefficientChange = (row, seat, value) => {
    const { coefficients } = this.state;
    coefficients[row][seat].coefficient = parseFloat(value) || 1.0;
    this.setState({ coefficients });
  };

  handleSave = () => {
    const { onSave } = this.props;
    onSave(this.state.coefficients);
  };

  render() {
    const { classes, open, onClose, cinema } = this.props;
    const { coefficients } = this.state;

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Управление коэффициентами цен мест</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Базовая цена: {cinema?.basePrice} руб.
          </Typography>
          <Grid container spacing={2}>
            {coefficients.map((row, rowIndex) => (
              <Grid item xs={12} key={rowIndex}>
                <Typography variant="subtitle2">Ряд {rowIndex + 1}</Typography>
                <Grid container spacing={1}>
                  {row.map((seat, seatIndex) => (
                    <Grid item xs={2} key={seatIndex}>
                      <TextField
                        label={`Место ${seatIndex + 1}`}
                        type="number"
                        value={seat.coefficient}
                        onChange={(e) => this.handleCoefficientChange(rowIndex, seatIndex, e.target.value)}
                        inputProps={{ step: 0.1, min: 0.1 }}
                        fullWidth
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Отмена
          </Button>
          <Button onClick={this.handleSave} color="primary" variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

PlaceCoefficients.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  cinema: PropTypes.object,
  getPlaces: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  getPlaces
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PlaceCoefficients)); 