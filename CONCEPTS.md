# Backend Structure and Concepts

## Table of Contents
- [Project Structure](#project-structure)
- [Data Flow Overview](#data-flow-overview)
- [DTOs (Data Transfer Objects)](#dtos-data-transfer-objects)
- [Entities and Persistence](#entities-and-persistence)
- [Controllers](#controllers)
- [Services](#services)
- [Repositories](#repositories)
- [Configuration](#configuration)
- [Annotations Used](#annotations-used)
- [Libraries Used](#libraries-used)



## Project Structure

```
src/main/java/com/example/demo/
├── config/         # Configuration classes (CORS, Security)
├── controller/     # REST API controllers
├── dto/            # Data Transfer Objects (DTOs)
├── model/          # JPA Entities (database models)
├── repository/     # Spring Data JPA repositories
├── service/        # Business logic/services
```



## Data Flow Overview

1. **Client** sends a request (e.g., upload syllabus, generate study plan).
2. **Controller** receives the request, validates input, and calls the appropriate service.
3. **Service** contains business logic, interacts with repositories, processes data, and returns results.
4. **Repository** handles database operations (CRUD).
5. **DTOs** are used to transfer data between client, controller, and service layers, ensuring encapsulation and validation.
6. **Entities** represent the database structure and are persisted by JPA/Hibernate.



## DTOs (Data Transfer Objects)

**What are DTOs?**  
DTOs are plain Java objects used to transfer data between layers (especially between client and backend). They help decouple internal models from external APIs, enforce validation, and shape the data sent/received.

**Why did we use DTOs?**
- Prevent exposing internal entity structure.
- Add validation and documentation.
- Control what data is sent/received.

**For Example: `BusyHourDTO`**
``` java
public class BusyHourDTO {
    private LocalDateTime start;
    private LocalDateTime end;
    //then getters and setters...
}
```
- Used in requests to specify busy hours for study plan generation.



## Entities and Persistence

**Entities** are classes annotated with `@Entity` and represent the tables in the database.

**Example: `Syllabus`**
```java
@Entity
public class Syllabus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    // other fields...
}
```
- Managed by JPA/Hibernate.
- Persisted via repositories.





## Controllers

Controllers are annotated with `@RestController` and they handle HTTP requests.

**For Example: `SyllabusController`**
```java
@RestController
@RequestMapping("/api/syllabus")
public class SyllabusController {
    @PostMapping("/upload")
    public ResponseEntity<Syllabus> uploadSyllabus(...) { ... }
}
```
- Map endpoints to service methods.
- Validate and parse input.



## Services

Services contain business logic and are annotated with `@Service`.

**For Example: `StudyPlanService`**
```java
@Service
public class StudyPlanService {
    public StudyPlanResponse generateStudyPlan(GenerateStudyPlanRequest request) { ... }
}
```
- Handle core logic (e.g., generating study sessions, uploading syllabi and query).
- Interact with repositories.





## Repositories

Repositories extend Spring Data JPA interfaces and handle database operations.

**For Example:**
```java
public interface SyllabusRepository extends JpaRepository<Syllabus, Long> { }
```
- Provide CRUD operations for entities.



## Configuration

**CORS:**  
Configured in `WebConfig.java` to allow cross-origin requests on the front-end.

**Security:**  
Configured in `SecurityConfig.java` to allow or restrict access to endpoints In our case we Allowed acces to all endpoints for prototyping purposes.





## Annotations Used

- `@RestController` — Marks a class as a REST controller.
- `@RequestMapping`, `@PostMapping`, `@GetMapping` — Map HTTP requests to controller methods.
- `@Service` — Marks a class as a service.
- `@Entity` — Marks a class as a JPA entity.
- `@Id`, `@GeneratedValue` — Define primary key and auto-generation.
- `@Autowired` —  Dependency Injection.
- `@Bean`, `@Configuration` — Define configuration and beans.
- `@Valid`, `@NotNull` — Validation annotations.
- `@Schema` — OpenAPI/Swagger documentation.





## Libraries Used

- **Spring Boot** — Application framework.
- **Spring Web** — REST API support.
- **Spring Data JPA** — ORM and database access.
- **Hibernate** — JPA implementation.
- **Spring Security** — Security and authentication.
- **Swagger/OpenAPI** — API documentation.
- **Jakarta Validation** — Bean validation.
   
   

## Data Flow Example

1. **Client** sends a POST request to `/api/study-plan/generate` with a JSON body.
2. **StudyPlanController** receives the request and maps it to `GenerateStudyPlanRequest`.
3. **StudyPlanService** processes the request, fetches the syllabus, calculates sessions, and saves the plan.
4. **StudyPlanRepository** persists the plan.
5. **StudyPlanResponse** DTO is returned to the client.



# Subsidiary Explanations

### The Autowired Anotation: 
The `@Autowired` annotation is used in Spring to automatically inject dependencies into components (such as classes, fields, constructors, or methods). When Spring sees `@Autowired`, it looks for a matching bean in the application context and injects it, reducing the need for manual wiring.
    - **Field Injection:** Place `@Autowired` on a field to have Spring set it automatically.
    - **Constructor Injection:** Place `@Autowired` on a constructor (or omit it if there’s only one constructor) for preferred, immutable dependency injection.
    - **Setter Injection:** Place `@Autowired` on a setter method to inject dependencies via method calls.
    - **Optional Dependencies:** Use `required = false` to indicate that the dependency is optional.


### Jakarta Validation
 Jakarta Validation (formerly known as Bean Validation) is a specification for validating Java objects, typically used to ensure that data meets certain constraints before it is processed or persisted.
    Key Concepts
    Annotations: Constraints are declared using annotations on fields, methods, or classes. Common examples:
    @NotNull — Field must not be null.
    @Size(min=2, max=30) — String or collection must have a size within the given range.
    @Email — Field must be a valid email address.
    Custom Constraints: You can define your own validation annotations and logic.
    Validation API: The Validator interface is used to programmatically validate objects.
