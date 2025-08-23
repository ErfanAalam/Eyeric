import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../lib/supabaseClient";
import {
  Plus,
  Upload,
  Package,
  FileText,
  DollarSign,
  Shapes,
  TrendingUp,
  Award,
  Check,
  Loader2,
  Glasses,
  Users,
  Eye,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Select from 'react-select';
import imageCompression from 'browser-image-compression';

// Helper function to ensure precise number conversion
const toPreciseNumber = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  
  const num = Number(value);
  if (isNaN(num)) return null;
  
  // For prices, round to 2 decimal places
  if (num % 1 !== 0) {
    return Math.round(num * 100) / 100;
  }
  return num;
};



// Helper function to shift display orders for a specific category
const shiftDisplayOrders = async (columnName: string, newOrder: number) => {
  const { data, error: fetchError } = await supabase
    .from("products")
    .select(`id, ${columnName}`)
    .gte(columnName, newOrder)
    .order(columnName, { ascending: false });

  if (fetchError) {
    throw new Error(`Failed to update ${columnName}`);
  }

  function isValidProduct(obj: unknown): obj is { id: string; [key: string]: unknown } {
    if (typeof obj !== 'object' || obj === null) return false;
    const o = obj as Record<string, unknown>;
    return (
      typeof o.id === 'string' &&
      typeof o[columnName] === 'number'
    );
  }

  const productsToUpdate = Array.isArray(data)
    ? (data as unknown[]).reduce<{ id: string; value: number }[]>((acc, item) => {
        if (isValidProduct(item)) {
          acc.push({ id: item.id, value: item[columnName] as number });
        }
        return acc;
      }, [])
    : [];

  for (const prod of productsToUpdate) {
    await supabase
      .from("products")
      .update({ [columnName]: prod.value + 1 })
      .eq("id", prod.id);
  }
};

export type Product = {
  id?: string;
  title: string;
  description: string;
  original_price: number;
  discounted_price?: number;
  display_order?: number;
  bestseller?: boolean;
  latest_trend?: boolean;
  banner_image_1?: string;
  banner_image_2?: string;
  images: { url: string; display_order: number }[];
  sizes: string[];
  frame_material?: string;
  features: string[];
  shape_category?: string;
  tags: string[];
  gender_category: string[];
  type_category: string[];
  created_at?: string;
  updated_at?: string;
  is_lens_used?: boolean;
  quantity?: number;
  style_category?: string;
  lens_width?: number;
  bridge_width?: number;
  temple_length?: number;
  lens_category_id?: number;
  is_active?: boolean;
  product_serial_number?: string;
  frame_colour?: string;
  temple_colour?: string;
  special_product_categories?: string[];
  mens_display_order?: number;
  womens_display_order?: number;
  kids_display_order?: number;
  sunglasses_display_order?: number;
  eyeglasses_display_order?: number;
  computerglasses_display_order?: number;
  powered_sunglasses_display_order?: number;
  round_display_order?: number;
  cat_eye_display_order?: number;
  aviator_display_order?: number;
  wayfarer_display_order?: number;
  oval_display_order?: number;
  rectangle_display_order?: number;
  square_display_order?: number;
  latest_trend_display_order?: number;
  bestseller_display_order?: number;
};

const AddProductTab = ({ editProduct, onFinishEdit }: { editProduct?: Product | null, onFinishEdit?: () => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [shapeCategory, setShapeCategory] = useState("");
  const [latestTrend, setLatestTrend] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  
  // Category-specific display orders
  const [mensDisplayOrder, setMensDisplayOrder] = useState("");
  const [womensDisplayOrder, setWomensDisplayOrder] = useState("");
  const [kidsDisplayOrder, setKidsDisplayOrder] = useState("");
  const [sunglassesDisplayOrder, setSunglassesDisplayOrder] = useState("");
  const [eyeglassesDisplayOrder, setEyeglassesDisplayOrder] = useState("");
  const [computerglassesDisplayOrder, setComputerglassesDisplayOrder] = useState("");
  const [poweredSunglassesDisplayOrder, setPoweredSunglassesDisplayOrder] = useState("");
  const [roundDisplayOrder, setRoundDisplayOrder] = useState("");
  const [catEyeDisplayOrder, setCatEyeDisplayOrder] = useState("");
  const [aviatorDisplayOrder, setAviatorDisplayOrder] = useState("");
  const [wayfarerDisplayOrder, setWayfarerDisplayOrder] = useState("");
  const [ovalDisplayOrder, setOvalDisplayOrder] = useState("");
  const [rectangleDisplayOrder, setRectangleDisplayOrder] = useState("");
  const [squareDisplayOrder, setSquareDisplayOrder] = useState("");
  const [latestTrendDisplayOrder, setLatestTrendDisplayOrder] = useState("");
  const [bestsellerDisplayOrder, setBestsellerDisplayOrder] = useState("");
  const [bannerImage1, setBannerImage1] = useState<File | null>(null);
  const [bannerImage2, setBannerImage2] = useState<File | null>(null);
  const [images, setImages] = useState<{ url: string; display_order: number }[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImageDisplayOrders, setNewImageDisplayOrders] = useState<number[]>([]);
  const [sizes, setSizes] = useState([]);
  const [frameMaterial, setFrameMaterial] = useState("");
  const [features, setFeatures] = useState("");
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [genderOptions, setGenderOptions] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [shapeOptions, setShapeOptions] = useState<string[]>([]);
  const [isLensUsed, setIsLensUsed] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [styleCategory, setStyleCategory] = useState("");
  const [styleOptions, setStyleOptions] = useState<string[]>([]);
  const [frameMaterialOptions, setFrameMaterialOptions] = useState<string[]>([]);
  const [lensWidth, setLensWidth] = useState("");
  const [bridgeWidth, setBridgeWidth] = useState("");
  const [templeLength, setTempleLength] = useState("");
  const [lensCategories, setLensCategories] = useState([]);
  const [lensCategoryId, setLensCategoryId] = useState<number | null>(null);
  const [specialCategories, setSpecialCategories] = useState([]);
  const [selectedSpecialCategories, setSelectedSpecialCategories] = useState([]);
  const [allCoupons, setAllCoupons] = useState([]);
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [productSerialNumber, setProductSerialNumber] = useState("");
  const [frameColour, setFrameColour] = useState("");
  const [templeColour, setTempleColour] = useState("");

  // Add state for previews and removal flags
  const [bannerImage1Preview, setBannerImage1Preview] = useState<string | null>(null);
  const [bannerImage2Preview, setBannerImage2Preview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // array of URLs
  const [removeImages, setRemoveImages] = useState<boolean[]>([]); // array of bools



  useEffect(() => {
    const fetchCategories = async () => {
      type CategoryRow = { name: string };
      const genderRes = await supabase
        .from("categories")
        .select("name")
        .eq("category_type", "gender")
        .order("id", { ascending: true });
      const typeRes = await supabase
        .from("categories")
        .select("name")
        .eq("category_type", "type")
        .order("id", { ascending: true });
      const shapeRes = await supabase
        .from("categories")
        .select("name")
        .eq("category_type", "shape")
        .order("id", { ascending: true });
      const styleRes = await supabase
        .from("categories")
        .select("name")
        .eq("category_type", "style")
        .order("id", { ascending: true });
      const frameMaterialRes = await supabase
        .from("categories")
        .select("name")
        .eq("category_type", "frame_material")
        .order("id", { ascending: true });
      setGenderOptions(
        genderRes.data
          ? (genderRes.data as CategoryRow[]).map((c) => c.name)
          : []
      );
      setTypeOptions(
        typeRes.data ? (typeRes.data as CategoryRow[]).map((c) => c.name) : []
      );
      setShapeOptions(
        shapeRes.data ? (shapeRes.data as CategoryRow[]).map((c) => c.name) : []
      );
      setStyleOptions(
        styleRes.data ? (styleRes.data as CategoryRow[]).map((c) => c.name) : []
      );
      setFrameMaterialOptions(
        frameMaterialRes.data ? (frameMaterialRes.data as CategoryRow[]).map((c) => c.name) : []
      );
    };
    fetchCategories();
    const fetchLensCategories = async () => {
      const { data } = await supabase.from("lens_categories").select("*");
      setLensCategories(data || []);
    };
    fetchLensCategories();
    const fetchSpecialCategories = async () => {
      const { data } = await supabase.from("special_product_categories").select("*");
      setSpecialCategories(data || []);
    };
    fetchSpecialCategories();
    const fetchCoupons = async () => {
      const { data } = await supabase.from("coupons").select("id, code, discount_type, discount_value, is_active");
      setAllCoupons(data || []);
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (editProduct) {
      setTitle(editProduct.title || "");
      setDescription(editProduct.description || "");
      setOriginalPrice(editProduct.original_price?.toString() || "");
      setDiscountedPrice(editProduct.discounted_price?.toString() || "");
      setBannerImage1(null); // You may want to handle preview
      setBannerImage2(null);
      // Convert database images to state format
      const dbImages = editProduct.images || [];
      setImages(dbImages.map(img => ({ url: img.url, display_order: img.display_order })));
      setImagePreviews(dbImages.map(img => img.url));
      setSizes(editProduct.sizes || []);
      setFrameMaterial(editProduct.frame_material || "");
      setFrameColour(editProduct.frame_colour || "");
      setTempleColour(editProduct.temple_colour || "");
      setProductSerialNumber(editProduct.product_serial_number || "");
      setMensDisplayOrder(editProduct.mens_display_order?.toString() || "");
      setWomensDisplayOrder(editProduct.womens_display_order?.toString() || "");
      setKidsDisplayOrder(editProduct.kids_display_order?.toString() || "");
      setSunglassesDisplayOrder(editProduct.sunglasses_display_order?.toString() || "");
      setEyeglassesDisplayOrder(editProduct.eyeglasses_display_order?.toString() || "");
      setComputerglassesDisplayOrder(editProduct.computerglasses_display_order?.toString() || "");
      setPoweredSunglassesDisplayOrder(editProduct.powered_sunglasses_display_order?.toString() || "");
      setRoundDisplayOrder(editProduct.round_display_order?.toString() || "");
      setCatEyeDisplayOrder(editProduct.cat_eye_display_order?.toString() || "");
      setAviatorDisplayOrder(editProduct.aviator_display_order?.toString() || "");
      setWayfarerDisplayOrder(editProduct.wayfarer_display_order?.toString() || "");
      setOvalDisplayOrder(editProduct.oval_display_order?.toString() || "");
      setRectangleDisplayOrder(editProduct.rectangle_display_order?.toString() || "");
      setSquareDisplayOrder(editProduct.square_display_order?.toString() || "");
      setLatestTrendDisplayOrder(editProduct.latest_trend_display_order?.toString() || "");
      setBestsellerDisplayOrder(editProduct.bestseller_display_order?.toString() || "");
      setFeatures((editProduct.features || []).join('; '));
      setSelectedGenders(editProduct.gender_category || []);
      setSelectedTypes(editProduct.type_category || []);
      setShapeCategory(editProduct.shape_category || "");
      setLatestTrend(!!editProduct.latest_trend);
      setBestseller(!!editProduct.bestseller);
      setIsLensUsed(!!editProduct.is_lens_used);
      setQuantity(editProduct.quantity?.toString() || "");
      setStyleCategory(editProduct.style_category || "");
      setLensWidth(editProduct.lens_width?.toString() || "");
      setBridgeWidth(editProduct.bridge_width?.toString() || "");
      setTempleLength(editProduct.temple_length?.toString() || "");
      setLensCategoryId(editProduct.lens_category_id || null);
      setIsActive(editProduct.is_active !== false); // Default to true if not set
      setBannerImage1Preview(editProduct.banner_image_1 || null);
      setBannerImage2Preview(editProduct.banner_image_2 || null);
      setImagePreviews((editProduct.images || []).map(img => img.url));
      setRemoveImages((editProduct.images || []).map(() => false));
      // Set display orders for existing images
      setNewImageDisplayOrders((editProduct.images || []).map(img => img.display_order || 0));
      
      // Fetch special product categories for this product
      if (editProduct.id) {
        const fetchProductSpecialCategories = async () => {
          const { data: productSpecialCategories } = await supabase
            .from("product_special_categories")
            .select("special_category_id")
            .eq("product_id", editProduct.id);
          
          if (productSpecialCategories && productSpecialCategories.length > 0) {
            const specialCategoryIds = productSpecialCategories.map(psc => psc.special_category_id.toString());
            setSelectedSpecialCategories(specialCategoryIds);
          }
        };
        fetchProductSpecialCategories();
        
        // Fetch coupons for this product
        const fetchProductCoupons = async () => {
          const { data: productCoupons } = await supabase
            .from("product_coupons")
            .select("coupon_id")
            .eq("product_id", editProduct.id);
          
          if (productCoupons && productCoupons.length > 0) {
            const couponIds = productCoupons.map(pc => pc.coupon_id);
            setSelectedCoupons(couponIds);
          }
        };
        fetchProductCoupons();
      }
    }
  }, [editProduct]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

if(!title || !description || !originalPrice || !discountedPrice || !frameMaterial || !quantity || !styleCategory || !frameColour || !templeColour || !shapeCategory || !selectedGenders ||  !lensWidth || !bridgeWidth || !templeLength || !productSerialNumber ){
  setMessage("Please fill all the required fields");
  setLoading(false);
  return;
}


    // Validate discounted price
    if (discountedPrice && originalPrice) {
      const original = toPreciseNumber(originalPrice);
      const discounted = toPreciseNumber(discountedPrice);
      if (original && discounted && discounted >= original) {
        setMessage("Discounted price must be less than original price");
        setLoading(false);
        return;
      }
    }

    if (editProduct && editProduct.id) {
      // --- UPDATE LOGIC ---
      let bannerImage1Url = editProduct.banner_image_1 || "";
      let bannerImage2Url = editProduct.banner_image_2 || "";

      // Banner Image 1
      if (bannerImage1) {
        // Remove old image from storage if exists
        if (editProduct.banner_image_1) {
          const path = editProduct.banner_image_1.split("/product-images/")[1];
          if (path) await supabase.storage.from("product-images").remove([path]);
        }
        const filePath = `banners/${Date.now()}_1_${bannerImage1.name}`;
        const { error: uploadError1 } = await supabase.storage.from("product-images").upload(filePath, bannerImage1);
        if (uploadError1) {
          setMessage("Banner Image 1 upload failed");
          setLoading(false);
          return;
        }
        const { data: urlData1 } = supabase.storage.from("product-images").getPublicUrl(filePath);
        bannerImage1Url = urlData1.publicUrl;
      } else if (!bannerImage1Preview && editProduct.banner_image_1) {
        // Remove old image if user removed it
        const path = editProduct.banner_image_1.split("/product-images/")[1];
        if (path) await supabase.storage.from("product-images").remove([path]);
        bannerImage1Url = "";
      }

      // Banner Image 2
      if (bannerImage2) {
        if (editProduct.banner_image_2) {
          const path = editProduct.banner_image_2.split("/product-images/")[1];
          if (path) await supabase.storage.from("product-images").remove([path]);
        }
        const filePath = `banners/${Date.now()}_2_${bannerImage2.name}`;
        const { error: uploadError2 } = await supabase.storage.from("product-images").upload(filePath, bannerImage2);
        if (uploadError2) {
          setMessage("Banner Image 2 upload failed");
          setLoading(false);
          return;
        }
        const { data: urlData2 } = supabase.storage.from("product-images").getPublicUrl(filePath);
        bannerImage2Url = urlData2.publicUrl;
      } else if (!bannerImage2Preview && editProduct.banner_image_2) {
        const path = editProduct.banner_image_2.split("/product-images/")[1];
        if (path) await supabase.storage.from("product-images").remove([path]);
        bannerImage2Url = "";
      }

      // Handle product images - combine existing images with new uploaded images
      const existingImages = images.filter(img => typeof img.url === 'string');
      const newImageFiles = newImages;
      
      // Upload new images
      const uploadedImages = await Promise.all(newImageFiles.map(async (file, idx) => {
        const fileName = file.name;
        const filePath = `products/${Date.now()}_${idx}_${fileName}`;
        const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file);
        if (uploadError) {
          setMessage(`Image upload failed for image ${idx + 1}`);
          setLoading(false);
          return null;
        }
        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
        // Use custom display order or fallback to sequential
        return { url: urlData.publicUrl, display_order: newImageDisplayOrders[idx] > 0 ? newImageDisplayOrders[idx] : existingImages.length + idx + 1 };
      }));
      
      if (uploadedImages.some(img => img === null)) return; // error already set
      
      // Combine existing and new images
      const imageUploads = [...existingImages, ...uploadedImages.filter(img => img !== null)];
      console.log('imageUploads', imageUploads);
      if (imageUploads.some(img => img === null)) return; // error already set

      const updateObj: Partial<Product> = {
        title,
        description,
        original_price: toPreciseNumber(originalPrice),
        discounted_price: toPreciseNumber(discountedPrice),
        bestseller,
        latest_trend: latestTrend,
        banner_image_1: bannerImage1Url,
        banner_image_2: bannerImage2Url,
        images: imageUploads,
        sizes,
        frame_material: frameMaterial,
        features: features.split(';').map(f => f.trim()).filter(f => f.length > 0),
        gender_category: selectedGenders,
        type_category: selectedTypes,
        shape_category: shapeCategory,
        is_lens_used: isLensUsed,
        quantity: quantity ? parseInt(quantity, 10) : 0,
        style_category: styleCategory,
        lens_width: toPreciseNumber(lensWidth),
        bridge_width: toPreciseNumber(bridgeWidth),
        temple_length: toPreciseNumber(templeLength),
        lens_category_id: lensCategoryId,
        is_active: isActive,
        product_serial_number: productSerialNumber,
        frame_colour: frameColour,
        temple_colour: templeColour,
      };
      
      // Debug logging
      console.log('Update values:', {
        originalPrice: toPreciseNumber(originalPrice),
        discountedPrice: toPreciseNumber(discountedPrice),
        lensWidth: toPreciseNumber(lensWidth),
        bridgeWidth: toPreciseNumber(bridgeWidth),
        templeLength: toPreciseNumber(templeLength)
      });
      const { error } = await supabase.from("products").update(updateObj).eq("id", editProduct.id);
      if (error) {
        setMessage("Failed to update product");
        setLoading(false);
        return;
      }

      // Update product coupons
      // First, delete existing coupon associations
      await supabase.from("product_coupons").delete().eq("product_id", editProduct.id);
      
      // Then add new coupon associations
      if (selectedCoupons.length > 0) {
        const couponInserts = selectedCoupons.map(couponId => ({
          product_id: editProduct.id,
          coupon_id: couponId
        }));
        
        await supabase.from("product_coupons").insert(couponInserts);
      }
      
      setMessage("Product updated successfully!");
      if (onFinishEdit) onFinishEdit();
      setLoading(false);
      return;
    }

      // --- Category-specific Display Order Shift Logic ---
    const categoryDisplayOrders: Record<string, number> = {};
    
    // Gender categories
    if (selectedGenders.includes("men") && mensDisplayOrder) {
      const order = parseInt(mensDisplayOrder, 10);
      categoryDisplayOrders.mens_display_order = order;
      await shiftDisplayOrders("mens_display_order", order);
    }
    if (selectedGenders.includes("women") && womensDisplayOrder) {
      const order = parseInt(womensDisplayOrder, 10);
      categoryDisplayOrders.womens_display_order = order;
      await shiftDisplayOrders("womens_display_order", order);
    }
    if (selectedGenders.includes("kids") && kidsDisplayOrder) {
      const order = parseInt(kidsDisplayOrder, 10);
      categoryDisplayOrders.kids_display_order = order;
      await shiftDisplayOrders("kids_display_order", order);
    }
    
    // Type categories
    if (selectedTypes.includes("sunglasses") && sunglassesDisplayOrder) {
      const order = parseInt(sunglassesDisplayOrder, 10);
      categoryDisplayOrders.sunglasses_display_order = order;
      await shiftDisplayOrders("sunglasses_display_order", order);
    }
    if (selectedTypes.includes("eyeglasses") && eyeglassesDisplayOrder) {
      const order = parseInt(eyeglassesDisplayOrder, 10);
      categoryDisplayOrders.eyeglasses_display_order = order;
      await shiftDisplayOrders("eyeglasses_display_order", order);
    }
    if (selectedTypes.includes("computerglasses") && computerglassesDisplayOrder) {
      const order = parseInt(computerglassesDisplayOrder, 10);
      categoryDisplayOrders.computerglasses_display_order = order;
      await shiftDisplayOrders("computerglasses_display_order", order);
    }
    if (selectedTypes.includes("powered sunglasses") && poweredSunglassesDisplayOrder) {
      const order = parseInt(poweredSunglassesDisplayOrder, 10);
      categoryDisplayOrders.powered_sunglasses_display_order = order;
      await shiftDisplayOrders("powered_sunglasses_display_order", order);
    }
    
    // Shape categories
    if (shapeCategory === "round" && roundDisplayOrder) {
      const order = parseInt(roundDisplayOrder, 10);
      categoryDisplayOrders.round_display_order = order;
      await shiftDisplayOrders("round_display_order", order);
    }
    if (shapeCategory === "cat-eye" && catEyeDisplayOrder) {
      const order = parseInt(catEyeDisplayOrder, 10);
      categoryDisplayOrders.cat_eye_display_order = order;
      await shiftDisplayOrders("cat_eye_display_order", order);
    }
    if (shapeCategory === "aviator" && aviatorDisplayOrder) {
      const order = parseInt(aviatorDisplayOrder, 10);
      categoryDisplayOrders.aviator_display_order = order;
      await shiftDisplayOrders("aviator_display_order", order);
    }
    if (shapeCategory === "wayfarer" && wayfarerDisplayOrder) {
      const order = parseInt(wayfarerDisplayOrder, 10);
      categoryDisplayOrders.wayfarer_display_order = order;
      await shiftDisplayOrders("wayfarer_display_order", order);
    }
    if (shapeCategory === "oval" && ovalDisplayOrder) {
      const order = parseInt(ovalDisplayOrder, 10);
      categoryDisplayOrders.oval_display_order = order;
      await shiftDisplayOrders("oval_display_order", order);
    }
    if (shapeCategory === "rectangle" && rectangleDisplayOrder) {
      const order = parseInt(rectangleDisplayOrder, 10);
      categoryDisplayOrders.rectangle_display_order = order;
      await shiftDisplayOrders("rectangle_display_order", order);
    }
    if (shapeCategory === "square" && squareDisplayOrder) {
      const order = parseInt(squareDisplayOrder, 10);
      categoryDisplayOrders.square_display_order = order;
      await shiftDisplayOrders("square_display_order", order);
    }
    
    // Latest Trend and Bestseller display orders
    if (latestTrend && latestTrendDisplayOrder) {
      const order = parseInt(latestTrendDisplayOrder, 10);
      categoryDisplayOrders.latest_trend_display_order = order;
      await shiftDisplayOrders("latest_trend_display_order", order);
    }
    if (bestseller && bestsellerDisplayOrder) {
      const order = parseInt(bestsellerDisplayOrder, 10);
      categoryDisplayOrders.bestseller_display_order = order;
      await shiftDisplayOrders("bestseller_display_order", order);
    }

    // Upload banner images
    let bannerImage1Url = "";
    let bannerImage2Url = "";
    if (bannerImage1) {
      const filePath = `banners/${Date.now()}_1_${bannerImage1.name}`;
      const { error: uploadError1 } = await supabase.storage
        .from("product-images")
        .upload(filePath, bannerImage1);
      if (uploadError1) {
        setMessage("Banner Image 1 upload failed");
        setLoading(false);
        return;
      }
      const { data: urlData1 } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);
      bannerImage1Url = urlData1.publicUrl;
    }
    if (bannerImage2) {
      const filePath = `banners/${Date.now()}_2_${bannerImage2.name}`;
      const { error: uploadError2 } = await supabase.storage
        .from("product-images")
        .upload(filePath, bannerImage2);
      if (uploadError2) {
        setMessage("Banner Image 2 upload failed");
        setLoading(false);
        return;
      }
      const { data: urlData2 } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);
      bannerImage2Url = urlData2.publicUrl;
    }

          // Upload product images
      const imageUploads = await Promise.all(
        newImages.map(async (file, idx) => {
          const filePath = `products/${Date.now()}_${idx}_${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(filePath, file);
          if (uploadError) {
            setMessage(`Image upload failed for image ${idx + 1}`);
            setLoading(false);
            return null;
          }
          const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(filePath);
          // Use the custom display order instead of automatic
          return { url: urlData.publicUrl, display_order: newImageDisplayOrders[idx] > 0 ? newImageDisplayOrders[idx] : idx + 1 };
        })
      );
    if (imageUploads.some((img) => img === null)) return; // error already set

    // Prepare features array
    const featuresArray = features
      .split(";")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    // Always include the tag
    const tags = ["manufactured by Eyeric"];

    // Insert product with category-specific display orders
    const { data: inserted, error } = await supabase.from("products").insert({
      title,
      description,
      original_price: toPreciseNumber(originalPrice),
      discounted_price: toPreciseNumber(discountedPrice),
      bestseller,
      latest_trend: latestTrend,
      banner_image_1: bannerImage1Url,
      banner_image_2: bannerImage2Url,
      images: [...images, ...imageUploads.filter(img => img !== null)],
      sizes,
      shape_category: shapeCategory,
      style_category: styleCategory,
      frame_material: frameMaterial,
      features: featuresArray,
      tags,
      gender_category: selectedGenders,
      type_category: selectedTypes,
      is_lens_used: isLensUsed,
      quantity: quantity ? parseInt(quantity, 10) : 0,
      lens_width: toPreciseNumber(lensWidth),
      bridge_width: toPreciseNumber(bridgeWidth),
      temple_length: toPreciseNumber(templeLength),
      lens_category_id: lensCategoryId,
      is_active: isActive,
      product_serial_number: productSerialNumber,
      frame_colour: frameColour,
      temple_colour: templeColour,
      ...categoryDisplayOrders, // Spread all category display orders
    }).select();
    
    // Debug logging
    console.log('Insert values:', {
      originalPrice: toPreciseNumber(originalPrice),
      discountedPrice: toPreciseNumber(discountedPrice),
      lensWidth: toPreciseNumber(lensWidth),
      bridgeWidth: toPreciseNumber(bridgeWidth),
      templeLength: toPreciseNumber(templeLength)
    });

    if (error) {
      setMessage("Failed to add product");
      setLoading(false);
      return;
    }

    const newProductId = inserted && inserted[0] && inserted[0].id;
    if (newProductId && selectedSpecialCategories.length > 0) {
      for (const catId of selectedSpecialCategories) {
        await supabase.from("product_special_categories").insert({
          product_id: newProductId,
          special_category_id: catId
        });
      }
    }

    // --- Coupon assignment ---
    if (newProductId && selectedCoupons.length > 0) {
      for (const couponId of selectedCoupons) {
        await supabase.from("product_coupons").insert({ product_id: newProductId, coupon_id: couponId });
      }
    }

    setMessage("Product added successfully!");
    setTitle("");
    setDescription("");
    setOriginalPrice("");
    setDiscountedPrice("");
    setBannerImage1(null);
    setBannerImage2(null);
    setImages([]);
    setNewImages([]);
    setNewImageDisplayOrders([]);
    setSizes([]);
    setFrameMaterial("");
    setFeatures("");
    setSelectedGenders([]);
    setSelectedTypes([]);
    setLatestTrend(false);
    setBestseller(false);
    setIsLensUsed(false);
    setQuantity("");
    setStyleCategory("");
    setLensWidth("");
    setBridgeWidth("");
    setTempleLength("");
    setLensCategoryId(null);
    setIsActive(true);
          setSelectedSpecialCategories([]);
      setSelectedCoupons([]);
      setProductSerialNumber("");
      setFrameColour("");
      setTempleColour("");
      setFrameMaterial("");
    
    // Reset category-specific display orders
    setMensDisplayOrder("");
    setWomensDisplayOrder("");
    setKidsDisplayOrder("");
    setSunglassesDisplayOrder("");
    setEyeglassesDisplayOrder("");
    setComputerglassesDisplayOrder("");
    setPoweredSunglassesDisplayOrder("");
    setRoundDisplayOrder("");
    setCatEyeDisplayOrder("");
    setAviatorDisplayOrder("");
    setWayfarerDisplayOrder("");
    setOvalDisplayOrder("");
    setRectangleDisplayOrder("");
    setSquareDisplayOrder("");
    setLatestTrendDisplayOrder("");
    setBestsellerDisplayOrder("");
    
    setLoading(false);
  };

  // Banner image file input handlers
  const handleBannerImage1Change = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const compressedFile = await imageCompression(e.target.files[0], {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        });
        setBannerImage1(compressedFile);
        setBannerImage1Preview(URL.createObjectURL(compressedFile));
      } catch (_err: unknown) {
        console.error(_err);
        setMessage('Failed to compress Banner Image 1');
      }
    }
  };
  const handleBannerImage2Change = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const compressedFile = await imageCompression(e.target.files[0], {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        });
        setBannerImage2(compressedFile);
        setBannerImage2Preview(URL.createObjectURL(compressedFile));
      } catch (_err: unknown) {
        console.error(_err);
        setMessage('Failed to compress Banner Image 2');
      }
    }
  };

  // Remove banner image handlers
  const handleRemoveBannerImage1 = () => {
    setBannerImage1(null);
    setBannerImage1Preview(null);
  };
  const handleRemoveBannerImage2 = () => {
    setBannerImage2(null);
    setBannerImage2Preview(null);
  };

  // Image Handlers

  const handleImagesChange = async (files: FileList, replaceExisting: boolean = false) => {
    try {
      const compressedFiles = await Promise.all(
        Array.from(files).map(file =>
          imageCompression(file, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
          })
        )
      );

      if (replaceExisting) {
        // Replace existing images
        setNewImages(compressedFiles);
        // Set display orders starting from 1
        setNewImageDisplayOrders(compressedFiles.map((_, idx) => idx + 1));
      } else {
        // Add to existing images
        setNewImages(prev => [...prev, ...compressedFiles]);
        // Add display orders for new images
        const startOrder = newImageDisplayOrders.length + 1;
        setNewImageDisplayOrders(prev => [...prev, ...compressedFiles.map((_, idx) => startOrder + idx)]);
      }
      
      // Update previews
      const newPreviews = compressedFiles.map(file => URL.createObjectURL(file));
      const previewsCopy = [...imagePreviews];
      
      if (replaceExisting) {
        setImagePreviews(newPreviews);
      } else {
        setImagePreviews([...previewsCopy, ...newPreviews]);
      }
      
      // Update removal flags
      const removeCopy = [...removeImages];
      if (replaceExisting) {
        setRemoveImages(newPreviews.map(() => false));
      } else {
        setRemoveImages([...removeCopy, ...newPreviews.map(() => false)]);
      }
      
    } catch (_err: unknown) {
      console.error(_err);
      setMessage(`Failed to compress images`);
    }
  };



  // Add function to handle display order changes
  const handleDisplayOrderChange = (index: number, newOrder: number | string) => {
    const updatedOrders = [...newImageDisplayOrders];
    if (newOrder === '' || newOrder === 0) {
      // Allow empty or 0 values for proper clearing
      updatedOrders[index] = 0;
    } else {
      const cleanValue = newOrder.toString().replace(/[^0-9]/g, '');
      updatedOrders[index] = cleanValue ? parseInt(cleanValue, 10) : 0;
    }
    setNewImageDisplayOrders(updatedOrders);
  };

  // Helper function to format price inputs
  const handlePriceChange = (value: string, setter: (value: string) => void) => {
    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    if (parts.length > 2) return; // More than one decimal point
    if (parts[1] && parts[1].length > 2) return; // More than 2 decimal places
    setter(cleanValue);
  };

  // Helper function to format dimension inputs
  const handleDimensionChange = (value: string, setter: (value: string) => void) => {
    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    if (parts.length > 2) return; // More than one decimal point
    if (parts[1] && parts[1].length > 1) return; // More than 1 decimal place for dimensions
    setter(cleanValue);
  };

  // Remove image handler
  const handleRemoveImage = (imgIdx: number) => {
    const previewsCopy = [...imagePreviews];
    previewsCopy[imgIdx] = null;
    setImagePreviews(previewsCopy.filter(Boolean) as string[]);
    const removeCopy = [...removeImages];
    removeCopy[imgIdx] = true;
    setRemoveImages(removeCopy);
    // If editing, also clear from images array
    if (editProduct) {
      const updatedImages = [...images];
      updatedImages.splice(imgIdx, 1);
      setImages(updatedImages);
    }
    // Also remove from display orders
    const updatedOrders = [...newImageDisplayOrders];
    updatedOrders.splice(imgIdx, 1);
    setNewImageDisplayOrders(updatedOrders);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full ">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-300 shadow-black">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Add New Product
            </h1>
            <p className="text-gray-600">
              Create and customize your product listing
            </p>
          </div>

          {/* Form Card */}
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Banner Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Banner Image 1
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImage1Change}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {bannerImage1Preview && (
                  <div className="relative w-32 h-20 mt-2">
                    <Image height={128} width={192} src={bannerImage1Preview} alt="Banner 1 Preview" className="w-32 h-20 object-cover rounded-xl border shadow" />
                    <button type="button" onClick={handleRemoveBannerImage1} className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-600 hover:bg-red-100">✕</button>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Banner Image 2
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImage2Change}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {bannerImage2Preview && (
                  <div className="relative w-32 h-20 mt-2">
                    <Image height={128} width={192} src={bannerImage2Preview} alt="Banner 2 Preview" className="w-32 h-20 object-cover rounded-xl border shadow" />
                    <button type="button" onClick={handleRemoveBannerImage2} className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-600 hover:bg-red-100">✕</button>
                  </div>
                )}
              </div>
            </div>

            {/* Product Images */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Upload className="w-4 h-4" /> Product Images
              </label>
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async e => {
                        if (e.target.files) await handleImagesChange(e.target.files, true);
                      }}
                      className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.multiple = true;
                        input.onchange = async (e) => {
                          const target = e.target as HTMLInputElement;
                          if (target.files) await handleImagesChange(target.files, false);
                        };
                        input.click();
                      }}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-xs hover:bg-green-200 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add More
                    </button>
                  </div>
                  {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {imagePreviews.map((img, imgIdx) => (
                        <div key={imgIdx} className="relative w-20 h-20 group">
                          <Image height={80} width={80} src={img} alt={`Preview ${imgIdx}`} className="w-20 h-20 object-cover rounded border shadow" />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveImage(imgIdx)} 
                            className="absolute top-0 right-0 bg-white/80 rounded-full p-1 text-red-600 hover:bg-red-100"
                          >
                            ✕
                          </button>
                          <div className="absolute bottom-0 left-0 bg-white/80 rounded-full px-1 text-xs text-gray-600">
                            {imgIdx + 1}
                          </div>
                          {/* Display Order Input */}
                          <div className="absolute -bottom-8 left-0 right-0">
                            <input
                              type="text"
                              value={newImageDisplayOrders[imgIdx] || ''}
                              onChange={(e) => handleDisplayOrderChange(imgIdx, e.target.value)}
                              onBlur={(e) => {
                                // Set default value if empty on blur
                                if (e.target.value === '' || parseInt(e.target.value) < 1) {
                                  handleDisplayOrderChange(imgIdx, imgIdx + 1);
                                }
                              }}
                              className="w-full text-xs text-center border border-gray-300 rounded px-1 py-1"
                              placeholder={`${imgIdx + 1}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Product Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  placeholder="Enter product title..."
                />
              </div>
              {/* Product Serial Number */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Product Serial Number
                </label>
                <input
                  type="text"
                  value={productSerialNumber}
                  onChange={(e) => setProductSerialNumber(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  placeholder="Enter product serial number..."
                />
              </div>
              {/* Frame Material */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Shapes className="w-4 h-4" /> Frame Material
                </label>
                <select
                  value={frameMaterial}
                  onChange={(e) => setFrameMaterial(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                >
                  <option value="">Select Frame Material</option>
                  {frameMaterialOptions.map((material) => (
                    <option key={material} value={material}>
                      {material}
                    </option>
                  ))}
                </select>
              </div>
              {/* Frame Colour */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Shapes className="w-4 h-4" /> Frame Colour
                </label>
                <input
                  type="text"
                  value={frameColour}
                  onChange={(e) => setFrameColour(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  placeholder="Enter frame colour..."
                />
              </div>
              {/* Temple Colour */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Shapes className="w-4 h-4" /> Temple Colour
                </label>
                <input
                  type="text"
                  value={templeColour}
                  onChange={(e) => setTempleColour(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  placeholder="Enter temple colour..."
                />
              </div>
              {/* Original Price */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Original Price
                </label>
                <input
                  type="text"
                  value={originalPrice}
                  onChange={(e) => handlePriceChange(e.target.value, setOriginalPrice)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  placeholder="0.00"
                />
              </div>
              {/* Discounted Price */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Discounted Price
                </label>
                <input
                  type="text"
                  value={discountedPrice}
                  onChange={(e) => handlePriceChange(e.target.value, setDiscountedPrice)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none"
                placeholder="Describe your product..."
              />
            </div>

            {/* Features */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Shapes className="w-4 h-4" /> Features (semicolon separated)
              </label>
              <textarea
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 resize-none"
                placeholder="Feature 1; Feature 2; Feature 3"
              />
              <div className="text-xs text-slate-500 mt-1">
                Separate each feature with a semicolon (;)
              </div>
            </div>

            {/* Category-specific Display Orders */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Display Orders</h3>
              
              {/* Gender Display Orders */}
              {selectedGenders.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <h4 className="text-md font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Gender Display Orders
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedGenders.includes("men") && (
                      <div>
                        <label className="text-sm font-medium text-blue-700 mb-2 block">Men Display Order</label>
                        <input
                          type="number"
                          value={mensDisplayOrder}
                          onChange={(e) => setMensDisplayOrder(e.target.value)}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="Enter position for men..."
                        />
                      </div>
                    )}
                    {selectedGenders.includes("women") && (
                      <div>
                        <label className="text-sm font-medium text-blue-700 mb-2 block">Women Display Order</label>
                        <input
                          type="number"
                          value={womensDisplayOrder}
                          onChange={(e) => setWomensDisplayOrder(e.target.value)}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="Enter position for women..."
                        />
                      </div>
                    )}
                    {selectedGenders.includes("kids") && (
                      <div>
                        <label className="text-sm font-medium text-blue-700 mb-2 block">Kids Display Order</label>
                        <input
                          type="number"
                          value={kidsDisplayOrder}
                          onChange={(e) => setKidsDisplayOrder(e.target.value)}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="Enter position for kids..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Type Display Orders */}
              {selectedTypes.length > 0 && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
                  <h4 className="text-md font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Type Display Orders
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedTypes.includes("sunglasses") && (
                      <div>
                        <label className="text-sm font-medium text-indigo-700 mb-2 block">Sunglasses Display Order</label>
                        <input
                          type="number"
                          value={sunglassesDisplayOrder}
                          onChange={(e) => setSunglassesDisplayOrder(e.target.value)}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                          placeholder="Enter position for sunglasses..."
                        />
                      </div>
                    )}
                    {selectedTypes.includes("eyeglasses") && (
                      <div>
                        <label className="text-sm font-medium text-indigo-700 mb-2 block">Eyeglasses Display Order</label>
                        <input
                          type="number"
                          value={eyeglassesDisplayOrder}
                          onChange={(e) => setEyeglassesDisplayOrder(e.target.value)}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                          placeholder="Enter position for eyeglasses..."
                        />
                      </div>
                    )}
                    {selectedTypes.includes("computer glasses") && (
                      <div>
                        <label className="text-sm font-medium text-indigo-700 mb-2 block">Computer Glasses Display Order</label>
                        <input
                          type="number"
                          value={computerglassesDisplayOrder}
                          onChange={(e) => setComputerglassesDisplayOrder(e.target.value)}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                          placeholder="Enter position for computer glasses..."
                        />
                      </div>
                    )}
                    {selectedTypes.includes("powered sunglasses") && (
                      <div>
                        <label className="text-sm font-medium text-indigo-700 mb-2 block">Powered Sunglasses Display Order</label>
                        <input
                          type="number"
                          value={poweredSunglassesDisplayOrder}
                          onChange={(e) => setPoweredSunglassesDisplayOrder(e.target.value)}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                          placeholder="Enter position for powered sunglasses..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Shape Display Orders */}
              {shapeCategory && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                  <h4 className="text-md font-semibold text-green-900 mb-4 flex items-center gap-2">
                    <Shapes className="w-4 h-4" /> Shape Display Orders
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {shapeCategory === "round" && (
                      <div>
                        <label className="text-sm font-medium text-green-700 mb-2 block">Round Display Order</label>
                        <input
                          type="number"
                          value={roundDisplayOrder}
                          onChange={(e) => setRoundDisplayOrder(e.target.value)}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                          placeholder="Enter position for round shape..."
                        />
                      </div>
                    )}
                    {shapeCategory === "cat-eye" && (
                      <div>
                        <label className="text-sm font-medium text-green-700 mb-2 block">Cat-Eye Display Order</label>
                        <input
                          type="number"
                          value={catEyeDisplayOrder}
                          onChange={(e) => setCatEyeDisplayOrder(e.target.value)}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                          placeholder="Enter position for cat-eye shape..."
                        />
                      </div>
                    )}
                    {shapeCategory === "aviator" && (
                      <div>
                        <label className="text-sm font-medium text-green-700 mb-2 block">Aviator Display Order</label>
                        <input
                          type="number"
                          value={aviatorDisplayOrder}
                          onChange={(e) => setAviatorDisplayOrder(e.target.value)}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                          placeholder="Enter position for aviator shape..."
                        />
                      </div>
                    )}
                    {shapeCategory === "wayfarer" && (
                      <div>
                        <label className="text-sm font-medium text-green-700 mb-2 block">Wayfarer Display Order</label>
                        <input
                          type="number"
                          value={wayfarerDisplayOrder}
                          onChange={(e) => setWayfarerDisplayOrder(e.target.value)}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                          placeholder="Enter position for wayfarer shape..."
                        />
                      </div>
                    )}
                    {shapeCategory === "oval" && (
                      <div>
                        <label className="text-sm font-medium text-green-700 mb-2 block">Oval Display Order</label>
                        <input
                          type="number"
                          value={ovalDisplayOrder}
                          onChange={(e) => setOvalDisplayOrder(e.target.value)}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                          placeholder="Enter position for oval shape..."
                        />
                      </div>
                    )}
                    {shapeCategory === "rectangle" && (
                      <div>
                        <label className="text-sm font-medium text-green-700 mb-2 block">Rectangle Display Order</label>
                        <input
                          type="number"
                          value={rectangleDisplayOrder}
                          onChange={(e) => setRectangleDisplayOrder(e.target.value)}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                          placeholder="Enter position for rectangle shape..."
                        />
                      </div>
                    )}
                    {shapeCategory === "square" && (
                      <div>
                        <label className="text-sm font-medium text-green-700 mb-2 block">Square Display Order</label>
                        <input
                          type="number"
                          value={squareDisplayOrder}
                          onChange={(e) => setSquareDisplayOrder(e.target.value)}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                          placeholder="Enter position for square shape..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Latest Trend & Bestseller Display Orders */}
              {(latestTrend || bestseller) && (
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                  <h4 className="text-md font-semibold text-purple-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Latest Trend & Bestseller Display Orders
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {latestTrend && (
                      <div>
                        <label className="text-sm font-medium text-purple-700 mb-2 block">Latest Trend Display Order</label>
                        <input
                          type="number"
                          value={latestTrendDisplayOrder}
                          onChange={(e) => setLatestTrendDisplayOrder(e.target.value)}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                          placeholder="Enter position for latest trend..."
                        />
                      </div>
                    )}
                    {bestseller && (
                      <div>
                        <label className="text-sm font-medium text-purple-700 mb-2 block">Bestseller Display Order</label>
                        <input
                          type="number"
                          value={bestsellerDisplayOrder}
                          onChange={(e) => setBestsellerDisplayOrder(e.target.value)}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                          placeholder="Enter position for bestseller..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Lens Category Dropdown */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Lens Category
              </label>
              <select
                value={lensCategoryId || ""}
                onChange={e => setLensCategoryId(e.target.value ? parseInt(e.target.value, 10) : null)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
              >
                <option value="">Select Lens Category</option>
                {lensCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Special Product Categories */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Special Product Categories</label>
              <Select
                isMulti
                options={specialCategories.map(cat => ({
                  value: cat.id.toString(),
                  label: cat.name + (cat.description ? ` - ${cat.description}` : "")
                }))}
                value={specialCategories
                  .filter(cat => selectedSpecialCategories.includes(cat.id.toString()))
                  .map(cat => ({
                    value: cat.id.toString(),
                    label: cat.name + (cat.description ? ` - ${cat.description}` : "")
                  }))}
                onChange={selected => {
                  setSelectedSpecialCategories(selected ? selected.map(opt => opt.value) : []);
                }}
                classNamePrefix="react-select"
                placeholder="Select special categories..."
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                styles={{
                  menu: base => ({ ...base, zIndex: 100 }),
                  control: base => ({ ...base, minHeight: 48, borderRadius: '1rem' }),
                  multiValue: base => ({ ...base, borderRadius: '0.5rem', background: '#e0e7ff' }),
                }}
              />
            </div>

            {/* Coupon Selection */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                Coupons Applicable to this Product
              </label>
              <Select
                isMulti
                options={allCoupons.filter(c => c.is_active).map(coupon => ({
                  value: coupon.id.toString(),
                  label: `${coupon.code} - ${coupon.discount_type === 'flat' ? `₹${coupon.discount_value} off` : coupon.discount_type === 'percentage' ? `${coupon.discount_value}% off` : coupon.discount_type}`
                }))}
                value={allCoupons
                  .filter(coupon => selectedCoupons.includes(coupon.id))
                  .map(coupon => ({
                    value: coupon.id.toString(),
                    label: `${coupon.code} - ${coupon.discount_type === 'flat' ? `₹${coupon.discount_value} off` : coupon.discount_type === 'percentage' ? `${coupon.discount_value}% off` : coupon.discount_type}`
                  }))}
                onChange={selected => {
                  setSelectedCoupons(selected ? selected.map(opt => opt.value) : []);
                }}
                classNamePrefix="react-select"
                placeholder="Select coupons..."
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                styles={{
                  menu: base => ({ ...base, zIndex: 100 }),
                  control: base => ({ ...base, minHeight: 48, borderRadius: '1rem' }),
                  multiValue: base => ({ ...base, borderRadius: '0.5rem', background: '#e0e7ff' }),
                }}
              />
            </div>

            {/* Quantity, Style, Sizes, Lens/Bridge/Temple, Gender, Type, Shape */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Quantity */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  Quantity
                </label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => {
                    const cleanValue = e.target.value.replace(/[^0-9]/g, '');
                    setQuantity(cleanValue);
                  }}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  placeholder="Enter quantity..."
                />
              </div>
              {/* Style Category */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  Style Category
                </label>
                <select
                  value={styleCategory}
                  onChange={(e) => setStyleCategory(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                >
                  <option value="">Select Style</option>
                  {styleOptions.map((style) => (
                    <option key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Gender
                </label>
                <div className="flex flex-col gap-2">
                  {genderOptions.map((gender) => (
                    <label
                      key={gender}
                      className="flex items-center gap-2 text-sm bg-slate-100 px-2 py-1 rounded-lg cursor-pointer hover:bg-blue-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGenders.includes(gender)}
                        onChange={(e) => {
                          if (e.target.checked)
                            setSelectedGenders([...selectedGenders, gender]);
                          else
                            setSelectedGenders(
                              selectedGenders.filter((g) => g !== gender)
                            );
                        }}
                        className="accent-blue-600"
                      />
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Type
                </label>
                <div className="flex flex-col gap-2">
                  {typeOptions.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-sm bg-slate-100 px-2 py-1 rounded-lg cursor-pointer hover:bg-blue-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked)
                            setSelectedTypes([...selectedTypes, type]);
                          else
                            setSelectedTypes(
                              selectedTypes.filter((t) => t !== type)
                            );
                        }}
                        className="accent-indigo-600"
                      />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Dropdown */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Shapes className="w-4 h-4" /> Size
                </label>
                <select
                  value={sizes[0] || ""}
                  onChange={(e) => setSizes([e.target.value])}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                >
                  <option value="">Select Size</option>
                  {["Small", "Medium", "Large", "Extra Large"].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              {/* Lens Width */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  Lens Width (mm)
                </label>
                <input
                  type="text"
                  value={lensWidth}
                  onChange={(e) => handleDimensionChange(e.target.value, setLensWidth)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  placeholder="Lens width in mm"
                />
              </div>
              {/* Bridge Width */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  Bridge Width (mm)
                </label>
                <input
                  type="text"
                  value={bridgeWidth}
                  onChange={(e) => handleDimensionChange(e.target.value, setBridgeWidth)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  placeholder="Bridge width in mm"
                />
              </div>
              {/* Temple Length */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  Temple Length (mm)
                </label>
                <input
                  type="text"
                  value={templeLength}
                  onChange={(e) => handleDimensionChange(e.target.value, setTempleLength)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  placeholder="Temple length in mm"
                />
              </div>

              {/* Shape */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Shapes className="w-4 h-4" /> Shape
                </label>
                <select
                  value={shapeCategory}
                  onChange={(e) => setShapeCategory(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                >
                  <option value="">Select Shape</option>
                  {shapeOptions.map((shape) => (
                    <option key={shape} value={shape}>
                      {shape.charAt(0).toUpperCase() + shape.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Latest Trend & Bestseller */}
            <div className="flex flex-wrap gap-6 items-center">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={latestTrend}
                    onChange={(e) => setLatestTrend(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                      latestTrend
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500 scale-110"
                        : "border-slate-300 group-hover:border-blue-400 group-hover:scale-105"
                    }`}
                  >
                    {latestTrend && (
                      <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 group-hover:text-blue-600 transition-colors duration-200">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Latest Trend</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={bestseller}
                    onChange={(e) => setBestseller(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                      bestseller
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500 scale-110"
                        : "border-slate-300 group-hover:border-blue-400 group-hover:scale-105"
                    }`}
                  >
                    {bestseller && (
                      <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 group-hover:text-blue-600 transition-colors duration-200">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-medium">Bestseller</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isLensUsed}
                    onChange={(e) => setIsLensUsed(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                      isLensUsed
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500 scale-110"
                        : "border-slate-300 group-hover:border-blue-400 group-hover:scale-105"
                    }`}
                  >
                    {isLensUsed && (
                      <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 group-hover:text-blue-600 transition-colors duration-200">
                  <Glasses className="w-4 h-4" />
                  <span className="text-sm font-medium">Lens Used</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 scale-110"
                        : "border-slate-300 group-hover:border-green-400 group-hover:scale-105"
                    }`}
                  >
                    {isActive && (
                      <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 group-hover:text-green-600 transition-colors duration-200">
                  <div className={`w-4 h-4 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm font-medium">{isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </label>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-2xl text-sm font-medium transition-all duration-500 ${
                  message.includes("successfully")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                } shadow-lg flex items-center gap-2`}
              >
                {message.includes("successfully") ? (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold disabled:opacity-50 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Adding Product...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" /> Add Product
                </>
              )}
            </button>
          </form>
        </div>
      </div>


    </div>
  );
};

export default AddProductTab;
