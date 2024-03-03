package team.bham.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import team.bham.domain.Item;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ItemRepositoryWithBagRelationshipsImpl implements ItemRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Item> fetchBagRelationships(Optional<Item> item) {
        return item.map(this::fetchEnergyIntakeResults);
    }

    @Override
    public Page<Item> fetchBagRelationships(Page<Item> items) {
        return new PageImpl<>(fetchBagRelationships(items.getContent()), items.getPageable(), items.getTotalElements());
    }

    @Override
    public List<Item> fetchBagRelationships(List<Item> items) {
        return Optional.of(items).map(this::fetchEnergyIntakeResults).orElse(Collections.emptyList());
    }

    Item fetchEnergyIntakeResults(Item result) {
        return entityManager
            .createQuery("select item from Item item left join fetch item.energyIntakeResults where item is :item", Item.class)
            .setParameter("item", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Item> fetchEnergyIntakeResults(List<Item> items) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, items.size()).forEach(index -> order.put(items.get(index).getId(), index));
        List<Item> result = entityManager
            .createQuery("select distinct item from Item item left join fetch item.energyIntakeResults where item in :items", Item.class)
            .setParameter("items", items)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
