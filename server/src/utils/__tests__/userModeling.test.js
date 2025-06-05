const Reservation = require('../../models/reservation');
const Movie = require('../../models/movie');
const Cinema = require('../../models/cinema');

jest.mock('../../models/reservation');
jest.mock('../../models/movie');
jest.mock('../../models/cinema');

const {
  cinemaUserModeling,
  moviesUserModeling,
  reservationSeatsUserModeling,
} = require('../userModeling');

describe('userModeling utilities', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('cinemaUserModeling sorts cinemas based on past reservations', async () => {
    const cinemas = [
      { _id: 'c1', name: 'Cinema 1' },
      { _id: 'c2', name: 'Cinema 2' },
      { _id: 'c3', name: 'Cinema 3' },
    ];

    Reservation.find.mockResolvedValue([
      { cinemaId: 'c3' },
      { cinemaId: 'c2' },
      { cinemaId: 'c3' },
    ]);

    const result = await cinemaUserModeling(cinemas, 'john');
    const ids = result.map(c => c._id);
    expect(ids).toEqual(['c3', 'c2', 'c1']);
  });

  test('moviesUserModeling returns movies sorted by preference', async () => {
    const today = new Date();
    const past = new Date(today.getTime() - 86400000);
    const future = new Date(today.getTime() + 86400000);

    Movie.find.mockResolvedValue([
      {
        _id: 'm1',
        genre: 'action,thriller',
        director: 'dir1',
        cast: 'actor1,actor2',
        releaseDate: past,
        endDate: future,
      },
      {
        _id: 'm2',
        genre: 'action,comedy',
        director: 'dir2',
        cast: 'actor1,actor3',
        releaseDate: past,
        endDate: future,
      },
      {
        _id: 'm3',
        genre: 'drama',
        director: 'dir3',
        cast: 'actor4',
        releaseDate: past,
        endDate: future,
      },
    ]);

    Reservation.find.mockResolvedValue([
      { movieId: 'm1' },
    ]);

    const result = await moviesUserModeling('john');
    const ids = result.map(m => m._id);
    expect(ids).toEqual(['m2']);
  });

  test('reservationSeatsUserModeling computes avg tickets and positions', async () => {
    Cinema.find.mockResolvedValue([
      { _id: 'c1', seats: [[], [], [], [], [], []] },
    ]);

    Reservation.find.mockResolvedValue([
      { cinemaId: 'c1', seats: [[1, 1], [1, 2]] },
      { cinemaId: 'c1', seats: [[3, 1]] },
      { cinemaId: 'c1', seats: [[5, 1]] },
    ]);

    const result = await reservationSeatsUserModeling('john', []);

    expect(result.numberOfTickets).toBe(1);
    expect(result.positions).toEqual({ front: 1, center: 1, back: 1 });
  });
});

