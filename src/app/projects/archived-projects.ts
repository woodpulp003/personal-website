import { Project } from './types';

export const archivedProjects: Project[] = [
  {
    title: 'Invariant Representation Learning from Equivariant Embeddings',
    description: 'Final project for [Statistical Learning Theory (6.7910)](https://poggio-lab.mit.edu/9-520/). \n\n Based on [Neural Isometries (NIso)](https://arxiv.org/abs/2405.19296) architecture, we used the [Group-Invariant Signatures](https://arxiv.org/pdf/1311.4158) proposed by Poggio et al. to demonstrate that equivariant embeddings led to more powerful signatures (and are thus better for classification), and better invariance of the signature. We used the Homography-perturbed MNIST (HomNIST) dataset for our experiments. Worked with E. Kim, L. Cai.',
    tags: ['Machine Learning', 'Research', 'Symmetry'],
    image: '/images/vinyl-placeholder-1.png',
    link: 'https://github.com/yourusername/invariant-learning',
    linkText: 'Code Upload in Progress',
  },
  {
    title: 'Real-time Beatbox Classifier using 1D CNNs',
    description: 'HackMIT 2024 Project. \n\nAn interactive system that uses 1D Convolutional Neural Networks to classify beatbox sounds in real-time. Implemented a game to teach users how to beatbox, or simply play along and have fun! \n\n Reduced bit-precision of model and implemented a strategy to run inference on model only when necessary. Created own training dataset with noisy augmentations to induce robustness. Worked with D. Villanueva and A. Chen.',
    tags: ['Audio Processing', 'Deep Learning', 'Real-time Systems'],
    image: '/images/vinyl-placeholder-2.png',
    link: 'https://github.com/yourusername/beatbox-classifier',
    linkText: 'Code Upload in Progress'
  },
  {
    title: 'CricketBOT: Robot that plays cricket',
    description: 'Final project for [Robotic Manipulation (6.4210)](https://manipulation.csail.mit.edu/Fall2024/). \n\n Built a robot simulation in Drake that can react to random ball throws and come up with shots on its own. Implemented ball tracking, trajectory prediction, motion planning and smooth execution for a Kuka-IIWA robot. Worked with M. Gadhiwala and M. Hegde.',
    tags: ['Robotics', 'Computer Vision', 'Hardware'],
    image: '/images/vinyl-placeholder-3.png',
    link: 'https://github.com/yourusername/cricketbot',
    linkText: 'Code Upload in Progress',
  },
  {
    title: 'ByteMe: Learn Audio Synthesis Interactively',
    description: 'Weblab 2024 Project. \n\n An interactive web application for learning audio synthesis concepts, building your own sounds, and playing them on a piano using a computer keyboard. Users can change the ADSR profile, waveform and other parameters of the sound, and save their sound presets. Worked with M. Hegde and N. Kothnur.',
    tags: ['Web Development', 'Audio', 'Education'],
    image: '/images/vinyl-placeholder-3.png',
    link: 'https://github.com/yourusername/bytime',
    linkText: 'Code Upload in Progress',
  },
  {
    title: 'Time Series Analysis for CPI Prediction',
    description: 'Project for [Statistics, Computation and Applications (6.3730)](https://student.mit.edu/catalog/m6c.html). \n\n Used autoregressive models, partial autocorrelograms and external regressors to improve the prediction model for the CPI (a proxy for inflation rates).',
    tags: ['Time Series', 'Economics', 'Data Science'],
    image: '/images/vinyl-placeholder-1.png',
    link: 'https://github.com/yourusername/cpi-prediction',
    linkText: 'Code Upload in Progress',
  }
]; 