# Visualization
```
#######################################################
Project Name: "Harmony Within: Exploring the Healing Power of Music on Mental Health"
Dev: Akshay Raghavan, Sujeeth Anil Vankudari
Description: Exploring music as a therapeutic tool for mental health
#######################################################
```

## Introduction
Music plays an integral part of our lives. It serves as a universal language that transcends borders and linguistic barriers. It allows to communicate feelings of joy, sorrow, passion, and peace. Do we listen to it as an outcome of these feelings, or to cope or elicit these feelings? This burning question inspired us to explore music as a therapeutic tool for mental health.

## Background
The problem at hand is the exploration of potential correlations between an individual’s music taste and their self-reported mental health - Insomnia, Depression, OCD, and Anxiety. Music therapy (MT) has been recognized as an evidence-based practice that uses music to improve an individual’s stress, mood, and overall mental health. However, the application of MT varies significantly across different organizations, particularly in terms of the range of music genres employed. This variation raises the question of whether the effectiveness of MT could be influenced by an individual’s personal music preferences.

## Data
The dataset is sourced from Kaggle containing information of 627 voluntary survey responses to a questionnaire recording information like users age, their favourite genre, how many hours a day the they listen to music, self-reported mental health scores of Anxiety, Depression, Insomnia, and OCD.

## Interaction Elements
1. Viewing distribution of Average Mental Health Scores for various Favourite Genres
  1. Click Any Mental Health in Average Scores Distribution
  2. Box Plot Updates
3. Viewing clusters of users within a specific Genre
  1. Click Any Genre in Box Plot
  2. Seek/Drag to Adjust Cluster Counts
  3. MDS Plot Updates with Black border circles depicting that genre
4. Understanding complex patterns across various variables
  1. Drag axis to rearrange
  2. Drag within axis to display range of data

## Interesting Insights
### Radar Plot:
1. Metal (Red), a heavier genre, showed lower average scores compared to Lofi (Yellow), which, as a calm and soothing genre, had higher scores. This contrast was particularly striking.
2. Metal (Red) and Rock (Blue), as similar genres, exhibited comparable mental health scores among their listeners.
3. Rap (Blue) scored higher in terms of depression compared to Metal (Red) and Rock (Inner Yellow), illustrating a specific correlation between mental health and music genres.

### PCP Plot:
Adults generally spend fewer hours per day listening to music compared to younger individuals, who often listen for longer periods [1]. This suggests that younger people might use music more frequently as a means of coping.

### MDS Plot:
The plot reveals a distinct segmentation and notable clustering among Metal users [circles with black border], highlighting interesting patterns within this group's listening behaviors.

## Results
We've noticed that younger individuals tend to report higher mental health scores. Additionally, those with higher mental health scores tend to prefer Lofi music as their favorite genre, suggesting a preference for calming music as a form of therapy.

## Run Instructions
1. Navigate to ~Viz-Project/src and run the python file ```server.py``` using the command ```python src/server.py```
2. In the output, a URL gets displayed. Open any browser of your choice and paste the URL. Now you must be able to view the dashboard

## Technologies Used
1. Python
2. HTML, CSS
3. Javascript, D3.js
4. Flask
