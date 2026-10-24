import { Injectable, signal, computed } from '@angular/core';
import { Artisan, Product, StoryArticle } from '../models/marketplace.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  // Artisans data
  private readonly artisans = signal<Artisan[]>([
    {
      id: 'artisan-1',
      name: 'Elena Morales',
      studioName: 'Barro Vivo Studio',
      location: 'Oaxaca, Mexico',
      country: 'Mexico',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      workshopImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80',
      bio: 'Third-generation potter crafting earthenware fired in subterranean wood kilns with natural river silt glazes.',
      story: 'Growing up surrounded by the volcanic clays of the Oaxaca valley, Elena learned the rhythms of the earth from her grandmother. She hand-digs all raw clays, leaves them to cure for months, and never uses synthetic pigments or automated wheels. Each piece carries the smoke marks of slow wood firings.',
      craftSpecialty: 'Wild Clay & Pit-Fired Ceramics',
      yearsCrafting: 16,
      badges: ['Master Potter', 'Zero Waste', 'Heritage Tradition'],
      verified: true
    },
    {
      id: 'artisan-2',
      name: 'Søren & Maren Lindqvist',
      studioName: 'Nordic Grain Atelier',
      location: 'Småland, Sweden',
      country: 'Sweden',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      workshopImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
      bio: 'Husband and wife woodcarvers shaping heirloom kitchenware exclusively from fallen Swedish birch and windfall oak.',
      story: 'Søren and Maren believe wood is at its most beautiful when its organic growth knots and grain imperfections are celebrated rather than planed away. Working from their red timber cabin in southern Sweden, every spoon and trencher is hand-hewn using traditional Japanese drawknives and finished in cold-pressed organic flaxseed oil.',
      craftSpecialty: 'Windfall Oak & Hand-turned Wood',
      yearsCrafting: 12,
      badges: ['Fallen Timber Only', 'Food-Safe Organic Oil', 'Lifetime Guarantee'],
      verified: true
    },
    {
      id: 'artisan-3',
      name: 'Aiko Tanaka',
      studioName: 'Tanaka Woven Loom',
      location: 'Kyoto, Japan',
      country: 'Japan',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      workshopImage: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=900&q=80',
      bio: 'Master weaver creating heirloom organic linen and raw indigo tapestries on a vintage 1940s wooden floor loom.',
      story: 'Aiko studied under national living treasure weavers in rural Nagano before returning to her family studio in Kyoto. She brews her own fermented indigo vats using dried persimmon tannin and river water, producing subtle gradations of blue that soften and grow richer with every wash.',
      craftSpecialty: 'Fermented Indigo & Organic Linen',
      yearsCrafting: 22,
      badges: ['Natural Botanical Dye', 'Vintage Handloom', 'Certified Organic'],
      verified: true
    },
    {
      id: 'artisan-4',
      name: 'Nora Gallagher',
      studioName: 'Burren Hide & Stitch',
      location: 'County Clare, Ireland',
      country: 'Ireland',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      workshopImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80',
      bio: 'Saddler-trained artisan creating vegetable-tanned leather essentials built to last through decades of daily use.',
      story: 'Nora cuts every hide by hand with antique Sheffield shears and saddle-stitches using waxed Irish linen thread. She eschews machine glueing and chrome tanning, relying only on Italian chestnut bark-tanned hides that develop a rich, honeyed patina that tells the story of your journeys.',
      craftSpecialty: 'Saddle-Stitched Vegetable Leather',
      yearsCrafting: 9,
      badges: ['Bark-Tanned Only', 'Hand Saddle-Stitched', 'Repair for Life'],
      verified: true
    },
    {
      id: 'artisan-5',
      name: 'Claire Dupont',
      studioName: 'Atelier de Cire Sauvage',
      location: 'Provence, France',
      country: 'France',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      workshopImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
      bio: 'Botanist and chandler pouring beeswax candles infused with wild herbs foraged in the Luberon foothills.',
      story: 'Claire sources unbleached cappings beeswax directly from three ethical beekeepers in Haute-Provence. She distills her own cypress, wild lavender, and rockrose essential oils in a small copper alembic, hand-pouring each batch into recycled stoneware vessels made by local ceramicists.',
      craftSpecialty: 'Wild Foraged Botanical Candles',
      yearsCrafting: 7,
      badges: ['Ethical Apiary Sourced', 'Pure Essential Distillate', 'Zero Paraffin'],
      verified: true
    },
    {
      id: 'artisan-6',
      name: 'Callum & Isla MacLeod',
      studioName: 'Highland Forge & Studio',
      location: 'Isle of Skye, Scotland',
      country: 'Scotland',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      workshopImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
      bio: 'Metalsmiths hand-hammering architectural brass tableware and jewelry inspired by ancient Pictish geometry.',
      story: 'Tucked beneath the Black Cuillin mountains, Callum and Isla hammer solid jeweler’s brass with hand-forged chasing tools. Every curve is deliberate, reflecting coastal stone contours, and every piece is treated with natural beeswax to prevent tarnishing while preserving metal warmth.',
      craftSpecialty: 'Hand-hammered Solid Brass',
      yearsCrafting: 14,
      badges: ['100% Recycled Brass', 'Anvil Forged', 'Heirloom Grade'],
      verified: true
    }
  ]);

  // Products data
  private readonly products = signal<Product[]>([
    {
      id: 'prod-1',
      title: 'Hand-Thrown Silt Clay Teapot',
      slug: 'hand-thrown-silt-clay-teapot',
      artisanId: 'artisan-1',
      artisan: this.artisans()[0],
      price: 118,
      category: 'Ceramics',
      materialTag: 'Wild Oaxaca Silt & Ash Glaze',
      processSummary: 'Slow-turned on manual kick-wheel and fired in outdoor pit kiln for 36 hours',
      narrativeStory: 'Elena shaped this teapot using silt scooped from the riverbanks of Tlacolula after autumn rains. Fired without gas or electricity in an earthen pit kiln with avocado wood, each vessel receives unpredictable smoky halos and a soft mineral texture that feels warm and comforting in the palms.',
      provenance: {
        origin: 'Oaxaca Valley, Mexico',
        workshop: 'Barro Vivo Studio kiln yard',
        leadTime: 'In stock — ships within 2 business days',
        shippingNotes: 'Packed in biodegradable wood-wool and compostable kraft carton'
      },
      materialsList: ['Wild Oaxaca River Silt Clay', 'Natural Ash Glaze', 'Woven Bamboo Handle', 'Terracotta Sealant'],
      images: [
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80'
      ],
      variants: {
        name: 'Kiln Finish',
        options: ['River Smoke (Mottled Grey)', 'Sunbaked Terracotta', 'Olive Ash Glaze']
      },
      dimensions: '6.5" H × 5.2" Diameter • Holds 24 fl oz',
      careInstructions: 'Hand rinse with warm water. Avoid chemical detergents to protect the unglazed breathability.',
      batchInfo: 'Limited batch of 14 pieces from November wood firing',
      inStock: true,
      rating: 4.9,
      reviewCount: 28,
      featured: true,
      reviews: [
        {
          id: 'rev-1',
          author: 'Camilla Thorne',
          location: 'San Francisco, CA',
          date: 'October 12, 2026',
          rating: 5,
          comment: 'The subtle weight and the smoky aroma of the kiln on day one were unforgettable. It pours like a dream with zero dripping.',
          customerPhoto: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80',
          verifiedPurchase: true
        },
        {
          id: 'rev-2',
          author: 'Julian Meyer',
          location: 'Berlin, Germany',
          date: 'September 28, 2026',
          rating: 5,
          comment: 'You can feel Elena’s thumbprints gently beneath the bamboo handle. This is the antithesis of mass production.',
          verifiedPurchase: true
        }
      ]
    },
    {
      id: 'prod-2',
      title: 'Heirloom Windfall Oak Trencher Board',
      slug: 'heirloom-windfall-oak-trencher-board',
      artisanId: 'artisan-2',
      artisan: this.artisans()[1],
      price: 84,
      category: 'Woodwork',
      materialTag: 'Fallen Småland White Oak',
      processSummary: 'Hand-hewn with Japanese drawknife and hand-rubbed with organic flaxseed oil',
      narrativeStory: 'Harvested from a 140-year-old oak that toppled during a winter gale in southern Sweden, Søren and Maren left the live bark edge intact on one boundary while hand-beveling the handle for effortless table service. No two grain swirls are alike.',
      provenance: {
        origin: 'Småland Woodlands, Sweden',
        workshop: 'Nordic Grain Atelier Timber Shed',
        leadTime: 'Crafted & conditioned — ships in 3 days',
        shippingNotes: 'Treated with fresh organic flax wax before dispatch'
      },
      materialsList: ['Salvaged Swedish White Oak', 'Cold-Pressed Organic Linseed Oil', 'Natural Beeswax Rub'],
      images: [
        'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1597843786271-2b0e358c5478?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
      ],
      variants: {
        name: 'Board Length',
        options: ['Medium (16 inches)', 'Long Baguette (22 inches)', 'Feasting Board (26 inches)']
      },
      dimensions: '16" L × 8.5" W × 1.2" Thick',
      careInstructions: 'Wipe with damp cloth; occasionally recondition with pure walnut or mineral oil.',
      batchInfo: 'Hand-carved individually from storm-felled timber stock',
      inStock: true,
      rating: 5.0,
      reviewCount: 34,
      featured: true,
      reviews: [
        {
          id: 'rev-3',
          author: 'Astrid Lind',
          location: 'Stockholm, Sweden',
          date: 'October 3, 2026',
          rating: 5,
          comment: 'We use this daily for sourdough and aged cheeses. The wood has a deep, warm glow that smells subtly of cedar and flax.',
          verifiedPurchase: true
        }
      ]
    },
    {
      id: 'prod-3',
      title: 'Handloom Indigo Organic Linen Throw',
      slug: 'handloom-indigo-organic-linen-throw',
      artisanId: 'artisan-3',
      artisan: this.artisans()[2],
      price: 165,
      category: 'Textiles',
      materialTag: 'Raw Japanese Flax & Fermented Indigo',
      processSummary: 'Woven on a 1940s vintage shuttle loom with 7 dip fermentations in botanical indigo',
      narrativeStory: 'Woven over 18 continuous hours on Aiko’s wooden floor loom, this throw blends unbleached French flax warp with Kyoto-dyed indigo weft. The resulting slub texture has a cool crispness in summer and retains gentle body warmth in winter.',
      provenance: {
        origin: 'Kamigyo Ward, Kyoto, Japan',
        workshop: 'Tanaka Heritage Loom Room',
        leadTime: 'Handmade batch ready for international courier',
        shippingNotes: 'Folded in washi paper with dried lavender branch'
      },
      materialsList: ['100% GOTS Organic Long-Staple Flax', 'Natural Fermented Indigo Vat', 'Botanical Persimmon Tannin'],
      images: [
        'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=1000&q=80'
      ],
      variants: {
        name: 'Indigo Depth',
        options: ['Deep Midnight Blue (7 Dips)', 'Chambray Sky (3 Dips)', 'Raw Flax & Indigo Border']
      },
      dimensions: '54" × 72" with 2" hand-twisted raw fringe',
      careInstructions: 'Gentle cycle in cold water with plant soap. Hang dry in shade to preserve indigo vitality.',
      batchInfo: 'Only 6 throws produced per month due to loom speed',
      inStock: true,
      rating: 4.8,
      reviewCount: 19,
      featured: true,
      reviews: [
        {
          id: 'rev-4',
          author: 'Hannah Davies',
          location: 'Bristol, United Kingdom',
          date: 'September 19, 2026',
          rating: 5,
          comment: 'The depth of blue is completely unlike anything from commercial textile mills. You can see the slight variations in the yarn.',
          verifiedPurchase: true
        }
      ]
    },
    {
      id: 'prod-4',
      title: 'Chestnut Bark-Tanned Field Satchel',
      slug: 'chestnut-bark-tanned-field-satchel',
      artisanId: 'artisan-4',
      artisan: this.artisans()[3],
      price: 245,
      category: 'Leather',
      materialTag: 'Italian Chestnut Bark-Tanned Leather',
      processSummary: 'Beveled and hand-saddle stitched with waxed Irish linen thread and solid brass hardware',
      narrativeStory: 'Nora spent two full days hand-stitching this field satchel using two needles in unison—the ancient saddler’s lockstitch that cannot unravel even if a single stitch is worn. Untreated with plastics or synthetic sealers, it will age from warm caramel to deep cognac over your lifetime.',
      provenance: {
        origin: 'County Clare, West Coast of Ireland',
        workshop: 'Burren Hide Studio',
        leadTime: 'Ships within 3 days directly from the Irish Atlantic coast',
        shippingNotes: 'Includes a pot of Nora’s beeswax & lanolin leather balm'
      },
      materialsList: ['Full-Grain Italian Chestnut Bark Leather', 'Waxed Irish Linen Thread', 'Sand-Cast Solid Brass Buckles'],
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80'
      ],
      variants: {
        name: 'Hardware Tone',
        options: ['Antique Sand-Cast Brass', 'Brushed Copper Patina', 'Forged Iron Matte']
      },
      dimensions: '14.5" W × 11" H × 3.5" D • Fits up to 14" laptop',
      careInstructions: 'Condition once yearly with enclosed natural leather balm.',
      batchInfo: 'Numbered piece #42 from Nora’s 2026 harvest collection',
      inStock: true,
      rating: 4.95,
      reviewCount: 41,
      featured: true,
      reviews: [
        {
          id: 'rev-5',
          author: 'Liam O’Connor',
          location: 'Dublin, Ireland',
          date: 'August 14, 2026',
          rating: 5,
          comment: 'The thick edges are burnished to perfection. The smell of genuine bark-tanned leather filled my entire living room upon opening.',
          verifiedPurchase: true
        }
      ]
    },
    {
      id: 'prod-5',
      title: 'Wild Luberon Beeswax & Cypress Candle',
      slug: 'wild-luberon-beeswax-cypress-candle',
      artisanId: 'artisan-5',
      artisan: this.artisans()[4],
      price: 42,
      category: 'Candles',
      materialTag: 'Unbleached Cappings Beeswax & Copper Distillate',
      processSummary: 'Hand-poured into local stoneware cups with pure unbleached cotton braided wick',
      narrativeStory: 'Claire gathers golden beeswax straight from honeycomb cappings in the lavender valleys of Provence. Melded with copper-distilled mountain cypress, wild thyme, and sun-baked rockrose, its flame emits a warm honeyed glow with negative-ion purifying qualities.',
      provenance: {
        origin: 'Luberon Natural Park, Provence, France',
        workshop: 'Atelier de Cire Sauvage',
        leadTime: 'Small batches poured weekly — ready to ship',
        shippingNotes: 'Vessel is reusable as an espresso cup once candle finishes'
      },
      materialsList: ['100% Raw French Beeswax', 'Wild Foraged Cypress & Thyme Oils', 'Unbleached Organic Cotton Wick'],
      images: [
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80'
      ],
      variants: {
        name: 'Scent Profile',
        options: ['Wild Cypress & Thyme', 'High Mountain Lavender & Pine', 'Sunlit Rockrose & Honey']
      },
      dimensions: '3.2" H × 3" Diameter • 55 Hour Burn Time',
      careInstructions: 'Trim wick to 1/4" before lighting. Burn for 2 hours on first light to create an even wax pool.',
      batchInfo: 'Poured in lots of 25 into wheel-thrown stoneware tumblers',
      inStock: true,
      rating: 4.85,
      reviewCount: 31,
      featured: false,
      reviews: [
        {
          id: 'rev-6',
          author: 'Chloe Laurent',
          location: 'Lyon, France',
          date: 'September 5, 2026',
          rating: 5,
          comment: 'Unlike synthetic store candles that cause headaches, this smells pure and earthy. The ceramic cup is lovely too.',
          verifiedPurchase: true
        }
      ]
    },
    {
      id: 'prod-6',
      title: 'Hand-Hammered Pictish Brass Hairpin & Pin',
      slug: 'hand-hammered-pictish-brass-hairpin',
      artisanId: 'artisan-6',
      artisan: this.artisans()[5],
      price: 52,
      category: 'Jewelry',
      materialTag: 'Solid Jeweler’s Brass & Highland Beeswax',
      processSummary: 'Cut, heated, and anvil-hammered on the Isle of Skye with antique cross-peen hammers',
      narrativeStory: 'Callum and Isla forge these hairpins on an 1890s anvil in their Skye workshop. The hammered faceting catches ambient candlelight with subtle golden warmth. The shape holds even thick or fine hair effortlessly without snapping or pulling.',
      provenance: {
        origin: 'Isle of Skye, Scottish Highlands',
        workshop: 'Highland Forge Anvil Studio',
        leadTime: 'Hand-finished to order — dispatch in 2 days',
        shippingNotes: 'Delivered in tartan pouch with brass polishing cloth'
      },
      materialsList: ['Recycled Cartridge Brass', 'Scottish Highland Heather Honey Wax', 'Faceted Chisel Detailing'],
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80'
      ],
      variants: {
        name: 'Hammer Texture',
        options: ['Fine Rain Facets', 'Bold Anvil Strike', 'Smooth Brushed Satin']
      },
      dimensions: '5.5" Length • 0.8 oz Weight',
      careInstructions: 'Polish with lemon juice or damp cloth to restore luster, or let natural bronze patina develop.',
      batchInfo: 'Forged individually at the anvil',
      inStock: true,
      rating: 5.0,
      reviewCount: 22,
      featured: false,
      reviews: [
        {
          id: 'rev-7',
          author: 'Morag Stewart',
          location: 'Edinburgh, Scotland',
          date: 'October 8, 2026',
          rating: 5,
          comment: 'Holds my hair through windy coastal walks without slipping once. A piece of wearable art.',
          verifiedPurchase: true
        }
      ]
    },
    {
      id: 'prod-7',
      title: 'Pit-Fired Stoneware Breakfast Bowl Set',
      slug: 'pit-fired-stoneware-breakfast-bowl-set',
      artisanId: 'artisan-1',
      artisan: this.artisans()[0],
      price: 92,
      category: 'Ceramics',
      materialTag: 'Unglazed Volcanic Clay & River Sand',
      processSummary: 'Double-thrown on wheel and slow-cooled in eucalyptus embers',
      narrativeStory: 'A nesting pair of wide breakfast bowls designed for rustic stews, morning porridge, and market salads. The rims are hand-burnished with smooth quartz river pebbles, creating a velvety tactile sensation against your lips.',
      provenance: {
        origin: 'Oaxaca Valley, Mexico',
        workshop: 'Barro Vivo Studio',
        leadTime: 'In stock — ships within 2 days',
        shippingNotes: 'Reinforced protective honeycomb cardboard pack'
      },
      materialsList: ['High-Iron Volcanic Red Clay', 'Quartz River Stone Burnishing', 'Eucalyptus Embers'],
      images: [
        'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80'
      ],
      dimensions: 'Set of 2: 7" Diameter × 3" H and 6" Diameter × 2.6" H',
      careInstructions: 'Microwave and dishwasher safe, though hand-washing preserves burnished gloss.',
      batchInfo: 'Batch 18 from autumn kiln cycle',
      inStock: true,
      rating: 4.88,
      reviewCount: 16,
      featured: false
    },
    {
      id: 'prod-8',
      title: 'Hand-Turned Windfall Walnut Salad Servers',
      slug: 'hand-turned-windfall-walnut-salad-servers',
      artisanId: 'artisan-2',
      artisan: this.artisans()[1],
      price: 68,
      category: 'Woodwork',
      materialTag: 'Reclaimed Småland Black Walnut',
      processSummary: 'Spindle-turned and hand-gouged with traditional Swedish gouges',
      narrativeStory: 'Maren carved this server pair to balance gracefully on the rim of deep wooden bowls. Made from deep dark heartwood with lighter sapwood highlights, they are warm to the touch and quiet against ceramic surfaces.',
      provenance: {
        origin: 'Småland, Sweden',
        workshop: 'Nordic Grain Atelier',
        leadTime: 'Crafted and oiled — ready to ship',
        shippingNotes: 'Ships in gift-ready linen drawstring bag'
      },
      materialsList: ['Reclaimed Småland Walnut', 'Cold-Pressed Linseed Oil', 'Natural Tree Wax'],
      images: [
        'https://images.unsplash.com/photo-1597843786271-2b0e358c5478?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=1000&q=80'
      ],
      dimensions: '11.5" Length × 3" Head Width',
      careInstructions: 'Never soak in water; dry immediately after hand washing.',
      batchInfo: 'Hand-hewn in limited quantities',
      inStock: true,
      rating: 4.92,
      reviewCount: 14,
      featured: false
    }
  ]);

  // Editorial Journal articles
  private readonly articles = signal<StoryArticle[]>([
    {
      id: 'art-1',
      title: 'The Breath of the Kiln: Why Wood-Fired Ceramics Feel Alive',
      subtitle: 'In the Oaxaca valley, Elena Morales explains why wild earth and unpredictable embers create objects with soul.',
      author: 'Maya Lin',
      authorRole: 'Craft Anthropologist & Writer',
      date: 'October 18, 2026',
      readTime: '6 min read',
      coverImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'In an era of computerized electric kilns calibrated to the fraction of a degree, a handful of independent potters still surrender their work to wild flame and shifting river clay.',
      contentParagraphs: [
        'Stand in the courtyard of Barro Vivo studio just before dawn, and you hear the kiln before you see it. It makes a deep, resonant rumble like a resting creature. Elena Morales tosses three logs of dried avocado wood into the combustion chamber, sparks scattering upward into the dark mountain sky.',
        '“People often ask me why I don’t use a digital kiln,” Elena says, brushing clay dust from her apron. “An electric kiln is a tool of certainty. But craft is not about certainty. When wood ash drifts over wet clay at 1200 degrees, the earth decides how it wants to be painted. Every smudge and blister is a record of that specific night’s wind.”',
        'In mainstream retail, variation is treated as a defect. In MarketNest, variation is the heartbeat of authenticity. When you drink your morning tea from a wood-fired cup, your fingertips trace the microscopic crystallization of minerals that were sleeping beneath the Oaxaca riverbed just six months earlier.'
      ],
      quote: 'An electric kiln gives you certainty. But craft is an intimate dialogue with the wild and the imperfect.',
      quoteAuthor: 'Elena Morales, Master Potter',
      category: 'Pottery & Kiln Arts',
      featuredProductId: 'prod-1'
    },
    {
      id: 'art-2',
      title: 'Listening to the Grain: The Art of Carving Fallen Timber',
      subtitle: 'Søren and Maren Lindqvist reflect on why they never cut down a living tree for their hand-carved tableware.',
      author: 'David Henrik',
      authorRole: 'Forestry & Woodwork Curator',
      date: 'September 24, 2026',
      readTime: '5 min read',
      coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Tucked deep into Sweden’s Småland forest, two makers wait for autumn gales to bring down ancient trees before picking up their hand drawknives.',
      contentParagraphs: [
        'Commercial timber operations prize uniform grain, knot-free planks, and rapid kiln-drying. But for Søren and Maren Lindqvist, timber that died naturally in the forest holds a completely different character.',
        '“When a hundred-year-old oak falls during a November blizzard, the tension in the wood releases slowly,” Søren explains. “The heartwood contains decades of drought, cold winters, and rain cycles. When we carve a trencher board, we aren’t imposing a design on the wood—we are simply uncovering what the tree has already written.”',
        'Their workshop uses no synthetic epoxies or polyurethane varnishes. Cold-pressed Swedish flaxseed oil soaks deep into the cellular structure of the oak, nourishing the fibers and allowing the board to heal itself as it is used year after year in family kitchens.'
      ],
      quote: 'We don’t cut trees down. We wait for the wind to offer us what the forest is ready to release.',
      quoteAuthor: 'Søren Lindqvist, Wood Artisan',
      category: 'Slow Forestry & Carving',
      featuredProductId: 'prod-2'
    },
    {
      id: 'art-3',
      title: 'The 40-Day Indigo Vat: How Slow Fermentation Outlasts Synthetic Dye',
      subtitle: 'In Kyoto, Aiko Tanaka stewards a centuries-old botanical dyeing tradition that grows more beautiful with time.',
      author: 'Kenji Sato',
      authorRole: 'Textile Historian',
      date: 'August 30, 2026',
      readTime: '7 min read',
      coverImage: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Unlike chemical blue dyes synthesized in petroleum factories, live indigo fermentation is an ecosystem of living microbes that breathe and age.',
      contentParagraphs: [
        'To walk into Aiko Tanaka’s Kyoto workshop is to enter an aromatic temple of earth, rice bran, and wood ash lye. Sunk deep into the earth floor are six ceramic jars, their surfaces capped with an iridescent indigo foam called "ai-no-hana" (the flower of indigo).',
        '“You cannot rush an indigo vat,” Aiko smiles softly. “If the morning is chilly, the microbes sleep. If you stir too violently, the oxygen imbalances the fermentation. We feed the vat sake and wheat bran like a family member.”',
        'When hand-spun linen is dipped into the green-tinted vat and pulled into the open air, a chemical miracle occurs before your eyes: the oxygen transforms the yellowish liquid into brilliant, indelible blue. Unlike modern fast fashion garments that fade and fray, naturally dyed fermented linen softens and deepens in nuance with every single washing.'
      ],
      quote: 'Fast fashion asks how fast an item can be made. Traditional craft asks how long an item can be cherished.',
      quoteAuthor: 'Aiko Tanaka, Master Weaver',
      category: 'Natural Fiber & Indigo',
      featuredProductId: 'prod-3'
    }
  ]);

  // Reactive state for search and filters
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string>('All');
  readonly selectedMaterial = signal<string>('All');
  readonly priceSort = signal<'default' | 'low-high' | 'high-low'>('default');
  readonly verifiedOnly = signal<boolean>(false);

  // Computed filtered products
  readonly filteredProducts = computed(() => {
    let list = this.products();

    // Category filter
    const cat = this.selectedCategory();
    if (cat !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === cat.toLowerCase());
    }

    // Material tag filter
    const mat = this.selectedMaterial();
    if (mat !== 'All') {
      list = list.filter(p => 
        p.materialTag.toLowerCase().includes(mat.toLowerCase()) || 
        p.materialsList.some(m => m.toLowerCase().includes(mat.toLowerCase()))
      );
    }

    // Verified only filter
    if (this.verifiedOnly()) {
      list = list.filter(p => p.artisan.verified);
    }

    // Search query
    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      list = list.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.artisan.name.toLowerCase().includes(query) ||
        p.artisan.studioName.toLowerCase().includes(query) ||
        p.artisan.location.toLowerCase().includes(query) ||
        p.materialTag.toLowerCase().includes(query) ||
        p.narrativeStory.toLowerCase().includes(query)
      );
    }

    // Sorting
    const sort = this.priceSort();
    if (sort === 'low-high') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === 'high-low') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  });

  // Getter methods
  getAllProducts(): Product[] {
    return this.products();
  }

  getFeaturedProducts(): Product[] {
    return this.products().filter(p => p.featured);
  }

  getProductById(id: string): Product | undefined {
    return this.products().find(p => p.id === id || p.slug === id);
  }

  getRelatedProducts(productId: string, category: string, limit: number = 3): Product[] {
    return this.products()
      .filter(p => p.id !== productId && p.category === category)
      .slice(0, limit);
  }

  getAllArtisans(): Artisan[] {
    return this.artisans();
  }

  getArtisanById(id: string): Artisan | undefined {
    return this.artisans().find(a => a.id === id);
  }

  getProductsByArtisan(artisanId: string): Product[] {
    return this.products().filter(p => p.artisanId === artisanId);
  }

  getAllArticles(): StoryArticle[] {
    return this.articles();
  }

  getArticleById(id: string): StoryArticle | undefined {
    return this.articles().find(a => a.id === id);
  }

  // Filter setters
  setCategory(cat: string) {
    this.selectedCategory.set(cat);
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  setMaterial(material: string) {
    this.selectedMaterial.set(material);
  }

  setPriceSort(sort: 'default' | 'low-high' | 'high-low') {
    this.priceSort.set(sort);
  }

  toggleVerifiedOnly() {
    this.verifiedOnly.update(v => !v);
  }

  resetFilters() {
    this.selectedCategory.set('All');
    this.selectedMaterial.set('All');
    this.searchQuery.set('');
    this.priceSort.set('default');
    this.verifiedOnly.set(false);
  }
}
