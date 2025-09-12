# What do we use in the application? It is a Java app. 
# Build Stage
FROM openjdk:24-jdk-slim

# Setting up a dir for the app 
WORKDIR /app

# Copy all the files to the container
COPY . .

# Install the dependencies 
RUN --mount=type=cache,target=/root/.m2 mvn clean package -DskipTests

# Runtime Stage
FROM openjdk:24-jdk-slim
WORKDIR /app
COPY . .

# Specify the port
EXPOSE 8080

# Run the app 
CMD ["java", "-jar", "target/library-0.0.1-SNAPSHOT.jar"]