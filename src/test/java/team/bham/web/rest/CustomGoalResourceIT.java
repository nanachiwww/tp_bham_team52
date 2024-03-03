package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.CustomGoal;
import team.bham.repository.CustomGoalRepository;

/**
 * Integration tests for the {@link CustomGoalResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CustomGoalResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/custom-goals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CustomGoalRepository customGoalRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCustomGoalMockMvc;

    private CustomGoal customGoal;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CustomGoal createEntity(EntityManager em) {
        CustomGoal customGoal = new CustomGoal().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return customGoal;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CustomGoal createUpdatedEntity(EntityManager em) {
        CustomGoal customGoal = new CustomGoal().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return customGoal;
    }

    @BeforeEach
    public void initTest() {
        customGoal = createEntity(em);
    }

    @Test
    @Transactional
    void createCustomGoal() throws Exception {
        int databaseSizeBeforeCreate = customGoalRepository.findAll().size();
        // Create the CustomGoal
        restCustomGoalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(customGoal)))
            .andExpect(status().isCreated());

        // Validate the CustomGoal in the database
        List<CustomGoal> customGoalList = customGoalRepository.findAll();
        assertThat(customGoalList).hasSize(databaseSizeBeforeCreate + 1);
        CustomGoal testCustomGoal = customGoalList.get(customGoalList.size() - 1);
        assertThat(testCustomGoal.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCustomGoal.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createCustomGoalWithExistingId() throws Exception {
        // Create the CustomGoal with an existing ID
        customGoal.setId(1L);

        int databaseSizeBeforeCreate = customGoalRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCustomGoalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(customGoal)))
            .andExpect(status().isBadRequest());

        // Validate the CustomGoal in the database
        List<CustomGoal> customGoalList = customGoalRepository.findAll();
        assertThat(customGoalList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = customGoalRepository.findAll().size();
        // set the field null
        customGoal.setName(null);

        // Create the CustomGoal, which fails.

        restCustomGoalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(customGoal)))
            .andExpect(status().isBadRequest());

        List<CustomGoal> customGoalList = customGoalRepository.findAll();
        assertThat(customGoalList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCustomGoals() throws Exception {
        // Initialize the database
        customGoalRepository.saveAndFlush(customGoal);

        // Get all the customGoalList
        restCustomGoalMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(customGoal.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getCustomGoal() throws Exception {
        // Initialize the database
        customGoalRepository.saveAndFlush(customGoal);

        // Get the customGoal
        restCustomGoalMockMvc
            .perform(get(ENTITY_API_URL_ID, customGoal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(customGoal.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingCustomGoal() throws Exception {
        // Get the customGoal
        restCustomGoalMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCustomGoal() throws Exception {
        // Initialize the database
        customGoalRepository.saveAndFlush(customGoal);

        int databaseSizeBeforeUpdate = customGoalRepository.findAll().size();

        // Update the customGoal
        CustomGoal updatedCustomGoal = customGoalRepository.findById(customGoal.getId()).get();
        // Disconnect from session so that the updates on updatedCustomGoal are not directly saved in db
        em.detach(updatedCustomGoal);
        updatedCustomGoal.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restCustomGoalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCustomGoal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCustomGoal))
            )
            .andExpect(status().isOk());

        // Validate the CustomGoal in the database
        List<CustomGoal> customGoalList = customGoalRepository.findAll();
        assertThat(customGoalList).hasSize(databaseSizeBeforeUpdate);
        CustomGoal testCustomGoal = customGoalList.get(customGoalList.size() - 1);
        assertThat(testCustomGoal.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCustomGoal.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingCustomGoal() throws Exception {
        int databaseSizeBeforeUpdate = customGoalRepository.findAll().size();
        customGoal.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCustomGoalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, customGoal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(customGoal))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomGoal in the database
        List<CustomGoal> customGoalList = customGoalRepository.findAll();
        assertThat(customGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCustomGoal() throws Exception {
        int databaseSizeBeforeUpdate = customGoalRepository.findAll().size();
        customGoal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCustomGoalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(customGoal))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomGoal in the database
        List<CustomGoal> customGoalList = customGoalRepository.findAll();
        assertThat(customGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCustomGoal() throws Exception {
        int databaseSizeBeforeUpdate = customGoalRepository.findAll().size();
        customGoal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCustomGoalMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(customGoal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CustomGoal in the database
        List<CustomGoal> customGoalList = customGoalRepository.findAll();
        assertThat(customGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCustomGoalWithPatch() throws Exception {
        // Initialize the database
        customGoalRepository.saveAndFlush(customGoal);

        int databaseSizeBeforeUpdate = customGoalRepository.findAll().size();

        // Update the customGoal using partial update
        CustomGoal partialUpdatedCustomGoal = new CustomGoal();
        partialUpdatedCustomGoal.setId(customGoal.getId());

        partialUpdatedCustomGoal.description(UPDATED_DESCRIPTION);

        restCustomGoalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCustomGoal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCustomGoal))
            )
            .andExpect(status().isOk());

        // Validate the CustomGoal in the database
        List<CustomGoal> customGoalList = customGoalRepository.findAll();
        assertThat(customGoalList).hasSize(databaseSizeBeforeUpdate);
        CustomGoal testCustomGoal = customGoalList.get(customGoalList.size() - 1);
        assertThat(testCustomGoal.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCustomGoal.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateCustomGoalWithPatch() throws Exception {
        // Initialize the database
        customGoalRepository.saveAndFlush(customGoal);

        int databaseSizeBeforeUpdate = customGoalRepository.findAll().size();

        // Update the customGoal using partial update
        CustomGoal partialUpdatedCustomGoal = new CustomGoal();
        partialUpdatedCustomGoal.setId(customGoal.getId());

        partialUpdatedCustomGoal.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restCustomGoalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCustomGoal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCustomGoal))
            )
            .andExpect(status().isOk());

        // Validate the CustomGoal in the database
        List<CustomGoal> customGoalList = customGoalRepository.findAll();
        assertThat(customGoalList).hasSize(databaseSizeBeforeUpdate);
        CustomGoal testCustomGoal = customGoalList.get(customGoalList.size() - 1);
        assertThat(testCustomGoal.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCustomGoal.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingCustomGoal() throws Exception {
        int databaseSizeBeforeUpdate = customGoalRepository.findAll().size();
        customGoal.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCustomGoalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, customGoal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(customGoal))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomGoal in the database
        List<CustomGoal> customGoalList = customGoalRepository.findAll();
        assertThat(customGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCustomGoal() throws Exception {
        int databaseSizeBeforeUpdate = customGoalRepository.findAll().size();
        customGoal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCustomGoalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(customGoal))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomGoal in the database
        List<CustomGoal> customGoalList = customGoalRepository.findAll();
        assertThat(customGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCustomGoal() throws Exception {
        int databaseSizeBeforeUpdate = customGoalRepository.findAll().size();
        customGoal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCustomGoalMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(customGoal))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CustomGoal in the database
        List<CustomGoal> customGoalList = customGoalRepository.findAll();
        assertThat(customGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCustomGoal() throws Exception {
        // Initialize the database
        customGoalRepository.saveAndFlush(customGoal);

        int databaseSizeBeforeDelete = customGoalRepository.findAll().size();

        // Delete the customGoal
        restCustomGoalMockMvc
            .perform(delete(ENTITY_API_URL_ID, customGoal.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CustomGoal> customGoalList = customGoalRepository.findAll();
        assertThat(customGoalList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
