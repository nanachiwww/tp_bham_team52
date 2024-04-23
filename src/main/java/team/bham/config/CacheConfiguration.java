package team.bham.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, team.bham.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, team.bham.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, team.bham.domain.User.class.getName());
            createCache(cm, team.bham.domain.Authority.class.getName());
            createCache(cm, team.bham.domain.User.class.getName() + ".authorities");
            createCache(cm, team.bham.domain.UserProfile.class.getName());
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".workouts");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".moodTrackers");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".stressTrackers");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".mindfulnessPractices");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".medicines");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".sleepRecords");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".customGoals");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".items");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".energyIntakeResults");
            createCache(cm, team.bham.domain.Workout.class.getName());
            createCache(cm, team.bham.domain.Exercise.class.getName());
            createCache(cm, team.bham.domain.Exercise.class.getName() + ".workouts");
            createCache(cm, team.bham.domain.Item.class.getName());
            createCache(cm, team.bham.domain.Item.class.getName() + ".energyIntakeResults");
            createCache(cm, team.bham.domain.EnergyIntakeResult.class.getName());
            createCache(cm, team.bham.domain.EnergyIntakeResult.class.getName() + ".items");
            createCache(cm, team.bham.domain.MoodTracker.class.getName());
            createCache(cm, team.bham.domain.StressTracker.class.getName());
            createCache(cm, team.bham.domain.MindfulnessPractice.class.getName());
            createCache(cm, team.bham.domain.MindfulnessTip.class.getName());
            createCache(cm, team.bham.domain.MindfulnessTip.class.getName() + ".practices");
            createCache(cm, team.bham.domain.Medicine.class.getName());
            createCache(cm, team.bham.domain.SleepRecord.class.getName());
            createCache(cm, team.bham.domain.CustomGoal.class.getName());
            createCache(cm, team.bham.domain.CompareResult.class.getName());
            createCache(cm, team.bham.domain.Dashboard.class.getName());
            createCache(cm, team.bham.domain.Workout.class.getName() + ".exercises");
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
